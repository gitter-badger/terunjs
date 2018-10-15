"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _chalk = _interopRequireDefault(require("chalk"));

var _util = require("../utils/util");

var _prompt = _interopRequireDefault(require("prompt"));

var _render = _interopRequireDefault(require("../utils/render"));

var _fs = _interopRequireDefault(require("fs"));

var _functions = _interopRequireDefault(require("../plugins/functions"));

var _symfony = require("../plugins/symfony");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RenderContext = new _render.default(['|>', '<|']);

class Make {
  constructor(config, command) {
    this.config = config;
    this.command = command;
    this.transport_files = [];
    this.global_args = {};
    this.plugins = {
      functions: new _functions.default(),
      "symfony:entity-form": new _symfony.SymfonyEntityForm()
    };
  }

  async init() {
    let isValid = this.validInit(this.config, this.command);
    if (!isValid) return;
    let command_select = this.config.commands[this.command]; //load global args COMMAND

    await this.getGlobalArgs(command_select); // get transport

    this.transport_files = command_select.transport;

    for (let transport of this.transport_files) {
      if (!this.validTransport(transport)) return;
      console.log(_chalk.default.magenta(`process: ${transport.from}`));
      await this.getTransport(transport);
    }

    console.log(_chalk.default.green("Success in create files!"));
  }

  getTransport(transport) {
    return new Promise((resolve, reject) => {
      _prompt.default.start();

      _prompt.default.get(transport.args, async (err, result) => {
        let base_dir = `${process.cwd()}${this.config.base_dir}`;
        let from_file = `${base_dir}${transport.from}`;
        let to_file = `${base_dir}${transport.to}`; // render file name with mustache js

        let argsToParseView = this.getArgsFromObject(transport.args, result);
        let argsToFileNameRender = Object.assign(argsToParseView, this.global_args);
        let to_file_rendered = RenderContext.renderSimple(to_file, argsToFileNameRender); // render final file

        let argsToParseViewRender = this.getArgsFromObject(transport.args, result); // start plugins transport FIXED SYMFONY HERE

        let plugins = transport.plugins;

        if (plugins) {
          let symfonyEntityReaderConfig = plugins.find(plugin => plugin.name == "symfony:entity-form");

          if (symfonyEntityReaderConfig) {
            symfonyEntityReaderConfig.from = RenderContext.renderSimple(symfonyEntityReaderConfig.from, argsToFileNameRender);
            let symfonyEntityReaderPLUGIN = this.plugins["symfony:entity-form"];
            symfonyEntityReaderPLUGIN.setConfig(symfonyEntityReaderConfig);
            argsToParseViewRender['symfony-form'] = await symfonyEntityReaderPLUGIN.getForm();
            argsToParseViewRender['symfony-entity-props'] = await symfonyEntityReaderPLUGIN._getProperties();
          }
        }

        let argsToRenderFile = Object.assign(argsToParseViewRender, this.global_args);
        let rendered_file = RenderContext.renderFile(from_file, argsToRenderFile);

        _fs.default.writeFile(to_file_rendered, rendered_file, 'utf-8', err => {
          if (err) throw new Error(err);
          resolve();
        });
      });
    });
  }

  getGlobalArgs(command_select) {
    let globalCommandArgs = command_select.args;
    if (globalCommandArgs && globalCommandArgs.length > 0) console.log(_chalk.default.magenta('set GLOBAL args: '));
    return new Promise((resolve, reject) => {
      _prompt.default.start();

      _prompt.default.get(globalCommandArgs, (err, result) => {
        this.global_args = this.getArgsFromObject(globalCommandArgs, result);
        resolve();
      });
    });
  }

  getArgsFromObject(args, objectToGetArg) {
    return args.reduce((ant, prox) => {
      let object_to_assign = {};
      object_to_assign[prox] = objectToGetArg[prox];
      return Object.assign(ant, object_to_assign);
    }, {});
  }

  validInit(config, command) {
    let errorsBaseConfig = (0, _util.validParameter)(config, ['base_dir', 'commands']);
    let isValid = true;

    if (errorsBaseConfig && errorsBaseConfig.length > 0) {
      isValid = false;
      return errorsBaseConfig.forEach(error => (0, _util.logError)(`Not found parameter ${error}`));
    }

    ;
    let command_select = config.commands[command];

    if (!command_select) {
      isValid = false;
      return (0, _util.logError)(`Not found command > ${command} <`);
    }

    return isValid;
  }

  validTransport(transport) {
    let errorParametersTransport = (0, _util.validParameter)(transport, ['from', 'to', 'args']);
    let isValid = true;

    if (errorParametersTransport && errorParametersTransport.length > 0) {
      isValid = false;
      return errorParametersTransport.forEach(error => (0, _util.logError)(`Not found parameter ${error}`));
    }

    ;
    return isValid;
  }

} // Utils


var _default = Make;
exports.default = _default;