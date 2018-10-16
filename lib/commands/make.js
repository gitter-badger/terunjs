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

var _mkdirRecursive = _interopRequireDefault(require("mkdir-recursive"));

var _plugins = _interopRequireDefault(require("../plugins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Make {
  constructor(config, command, tag_custom) {
    this.config = config;
    this.command = command;
    this.transport_files = [];
    this.global_args = {};
    this.render = new _render.default(tag_custom);
    this.plugins = new _plugins.default(this.render);
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

  async createDir(to) {
    let dirToCreate = `${(0, _util.dropFileName)(to)}`;
    return await _mkdirRecursive.default.mkdirSync(dirToCreate);
  }

  getTransport(transport) {
    return new Promise((resolve, reject) => {
      _prompt.default.start();

      _prompt.default.get(transport.args, async (err, result) => {
        this.plugins.init(transport.plugins);
        let base_dir = `${process.cwd()}${this.config.base_dir}`;
        let from_file = `${base_dir}${transport.from}`;
        let to_file = `${base_dir}${transport.to}`; // render file name with mustache js

        let argsToParseView = this.getArgsFromObject(transport.args, result);
        let argsToFileNameRender = Object.assign(argsToParseView, this.global_args);
        let to_file_rendered = this.render.renderSimple(to_file, argsToFileNameRender); // render final file ARGS

        let argsToParseViewRender = this.getArgsFromObject(transport.args, result);
        await this.plugins.config(argsToFileNameRender);
        argsToParseViewRender = await this.plugins.beforeRender(argsToParseViewRender);
        let argsToRenderFinalFile = Object.assign(argsToParseViewRender, this.global_args);
        let rendered_file = this.render.renderFile(from_file, argsToRenderFinalFile);
        await this.createDir(to_file_rendered).catch(err => {
          console.log(_chalk.default.red('Error on create folder'));
          throw new Error(err);
        });

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