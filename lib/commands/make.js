"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = _interopRequireDefault(require("fs"));

var _mkdirRecursive = _interopRequireDefault(require("mkdir-recursive"));

var _prompt = _interopRequireDefault(require("prompt"));

var _promptCheckbox = _interopRequireDefault(require("prompt-checkbox"));

var _plugins = _interopRequireDefault(require("../plugins"));

var _render = _interopRequireDefault(require("../utils/render"));

var _util = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Make {
  constructor(config, command, tag_custom) {
    this.config = config;
    this.command = command;
    this.transportFiles = [];
    this.globalArgs = {};
    this.render = new _render.default(tag_custom);
    this.plugins = new _plugins.default(this.render);
  }

  async init() {
    let isValid = this.validInit(this.config, this.command);
    if (!isValid) return;
    let commandSelected = this.config.commands[this.command]; //load global args COMMAND and config plugins

    await this.getGlobalArgs(commandSelected.args || []);
    this.plugins.init(commandSelected.plugins);
    await this.plugins.config(this.globalArgs, this.config, commandSelected.transport); // get transport

    this.transportFiles = commandSelected.transport;

    for (let transport of this.transportFiles) {
      if (!this.validTransport(transport)) return;
      console.log(_chalk.default.magenta(`process: ${transport.from}`));
      await this.getTransport(transport);
    }

    console.log(_chalk.default.green('Success in create files!'));
  }

  async createDir(to) {
    let dirToCreate = `${(0, _util.dropFileName)(to)}`;
    return await _mkdirRecursive.default.mkdirSync(dirToCreate);
  }

  async continueOverrideFile(pathFileExist) {
    let continueQuestion = () => {
      let checkbox = new _promptCheckbox.default({
        name: 'continue',
        message: 'File already exists, continue?',
        choices: ['Yes']
      });
      return checkbox.run();
    };

    let fileExist = _fs.default.existsSync(pathFileExist);

    let continueOverride = true;

    if (fileExist) {
      let continueQuestionAnswer = await continueQuestion();
      continueOverride = !continueQuestionAnswer.length == 0;
      if (!continueOverride) console.log(_chalk.default.yellow('Relax, you skipped file, nothing to do :)'));
    }

    return continueOverride;
  }

  async getTransport(transport) {
    await this.plugins.initTransport();
    return new Promise(resolve => {
      _prompt.default.start();

      _prompt.default.get(transport.args, async (err, result) => {
        if (err) throw new Error(err); // PATHS

        let baseDirPath = `${process.cwd()}${this.config.base_dir}`;
        let fromFilePath = `${baseDirPath}${transport.from}`;
        let toFilePath = `${baseDirPath}${transport.to}`; // render final file ARGS

        let argsToRenderInFile = this.getArgsFromObject(transport.args, result); // life cycle before render

        argsToRenderInFile = await this.plugins.beforeRender(argsToRenderInFile); // render file name with mustache js

        let argsToParseView = this.getArgsFromObject(transport.args, result);
        let toFileName = this.render.renderSimple(toFilePath, Object.assign(argsToParseView, this.globalArgs, argsToRenderInFile));
        let argsToRenderFinalFile = Object.assign(argsToRenderInFile, this.globalArgs);
        let fileRendered = this.render.renderFile(fromFilePath, argsToRenderFinalFile);
        await this.createDir(toFileName).catch(err => {
          console.log(_chalk.default.red('Error on create folder'));
          throw new Error(err);
        }); // let continueOverride = await this.continueOverrideFile(toFileName)
        // if(continueOverride)

        _fs.default.writeFile(toFileName, fileRendered, 'utf-8', err => {
          if (err) throw new Error(err);
        }); // Done life


        let done = await this.plugins.doneRender();

        if (done.loop) {
          await this.getTransport(transport);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  getGlobalArgs(commandSelectedArgs) {
    if (commandSelectedArgs.length > 0) console.log(_chalk.default.magenta('set GLOBAL args: '));
    return new Promise((resolve, reject) => {
      _prompt.default.start();

      _prompt.default.get(commandSelectedArgs, (err, result) => {
        this.globalArgs = this.getArgsFromObject(commandSelectedArgs, result);
        resolve();
      });
    });
  }

  getArgsFromObject(args, objectToGetArg) {
    return args.reduce((ant, prox) => {
      let objectToAssign = {};
      objectToAssign[prox] = objectToGetArg[prox];
      return Object.assign(ant, objectToAssign);
    }, {});
  }

  validInit(config, command) {
    let errorsBaseConfig = (0, _util.validParameter)(config, ['base_dir', 'commands']);
    let isValid = true;

    if (errorsBaseConfig && errorsBaseConfig.length > 0) {
      isValid = false;
      return errorsBaseConfig.forEach(error => (0, _util.logError)(`Not found parameter ${error}`));
    }

    let commandSelected = config.commands[command];

    if (!commandSelected) {
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

    return isValid;
  }

} // Utils


var _default = Make;
exports.default = _default;