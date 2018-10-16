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
    let command_select = this.config.commands[this.command]; //load global args COMMAND and config plugins

    await this.getGlobalArgs(command_select.args || []);
    this.plugins.init(command_select.plugins);
    await this.plugins.config(this.global_args); // get transport

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
        if (err) throw new Error(err); // PATHS

        let baseDirPath = `${process.cwd()}${this.config.base_dir}`;
        let fromFilePath = `${baseDirPath}${transport.from}`;
        let toFilePath = `${baseDirPath}${transport.to}`; // render final file ARGS

        let argsToRenderInFile = this.getArgsFromObject(transport.args, result); // life cycle before render

        argsToRenderInFile = await this.plugins.beforeRender(argsToRenderInFile); // render file name with mustache js

        let argsToParseView = this.getArgsFromObject(transport.args, result);
        let toFileName = this.render.renderSimple(toFilePath, Object.assign(argsToParseView, this.global_args, argsToRenderInFile));
        let argsToRenderFinalFile = Object.assign(argsToRenderInFile, this.global_args);
        let fileRendered = this.render.renderFile(fromFilePath, argsToRenderFinalFile);
        await this.createDir(toFileName).catch(err => {
          console.log(_chalk.default.red('Error on create folder'));
          throw new Error(err);
        });

        _fs.default.writeFile(toFileName, fileRendered, 'utf-8', err => {
          if (err) throw new Error(err);
          resolve();
        });
      });
    });
  }

  getGlobalArgs(commandSelectedArgs) {
    if (commandSelectedArgs.length > 0) console.log(_chalk.default.magenta('set GLOBAL args: '));
    return new Promise((resolve, reject) => {
      _prompt.default.start();

      _prompt.default.get(commandSelectedArgs, (err, result) => {
        this.global_args = this.getArgsFromObject(commandSelectedArgs, result);
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