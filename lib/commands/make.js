"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = _interopRequireDefault(require("fs"));

var _prompt = _interopRequireDefault(require("prompt"));

var _prompts = _interopRequireDefault(require("prompts"));

var _promptCheckbox = _interopRequireDefault(require("prompt-checkbox"));

var _plugins = _interopRequireDefault(require("../plugins"));

var _render = _interopRequireDefault(require("../core/render"));

var _transportManager = _interopRequireDefault(require("../core/transportManager"));

var _util = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Make {
  constructor(config, tag_custom) {
    this.config = config;
    this.commandArg = null;
    this.command = null;
    this.transportManager = new _transportManager.default();
    this.globalArgs = {};
    this.render = new _render.default(tag_custom);
    this.plugins = new _plugins.default(this.render);
    this.overrideAll = false;
    if (!(0, _util.validObjectThrow)(this.config, ['commands'])) return false;
  }

  async init() {
    //load global args COMMAND and config plugins
    this.globalArgs = await this.getGlobalArgs(this.command.args || []); // PLUGIN init

    this.plugins.init(this.command.plugins);
    await this.plugins.config({
      globalProperties: this.globalArgs,
      baseConfig: this.config,
      transportFiles: this.command.transport
    }); // TRANSPORT FILES

    this.transportManager.setFiles(this.command.transport);
    this.transportManager.setFragmentsFiles(this.config["transport-fragments"]);
    let validTransport = this.transportManager.validateTransportFiles();
    if (!validTransport) return false;

    for (let transport of this.transportManager.transportFiles) {
      console.log(_chalk.default.white.bgGreen.bold(`process: ${transport.from}`));
      await this.initResolveTransport(transport);
    }

    if (this.transportManager.transportFiles.length > 0) {
      console.log(_chalk.default.green('Success in create files!'));
      return true;
    } else {
      throw new Error(`Nothing to create!`);
    }
  }

  async initResolveTransport(transport) {
    if (!transport.args) {
      transport.args = [];
    }

    await this.plugins.initTransport({
      transport
    });
    return new Promise(async resolve => {
      await this.resolveTransport(transport, resolve);
    });
  }

  async resolveTransport(transport, doneCallback) {
    let promptResult = await (0, _prompts.default)(transport.transformArgsToPromptQuestion()); // PATHS

    let baseDirPath = `${process.cwd()}/`;
    let fromFilePath = `${baseDirPath}${transport.from}`;
    let toFilePath = `${baseDirPath}${transport.to}`; // render final file ARGS

    let argsToRenderInFile = promptResult; // life cycle before render

    argsToRenderInFile = await this.plugins.beforeRender({
      argsToParseViewRender: argsToRenderInFile
    }); // render file name with mustache js

    let toFileName = this.render.renderSimple(toFilePath, Object.assign(promptResult, this.globalArgs, argsToRenderInFile));
    let argsToRenderFinalFile = Object.assign(argsToRenderInFile, this.globalArgs);
    let fileRendered = this.render.renderFile(fromFilePath, argsToRenderFinalFile); // Cria os diretorios de forma recursiva.

    await (0, _util.createDir)(toFileName).catch(err => {
      throw new Error(_chalk.default.red('Error on create folder'));
    });
    let continueOverride = this.overrideAll ? true : await this.continueOverrideFile(toFileName);
    if (continueOverride) _fs.default.writeFile(toFileName, fileRendered, 'utf-8', err => {
      if (err) throw new Error(err);
    }); // Done life

    let done = await this.plugins.doneRender();

    if (done.loop) {
      await this.initResolveTransport(transport);
      doneCallback();
    } else {
      doneCallback();
    }
  }

  async continueOverrideFile(pathFile) {
    let fileExist = _fs.default.existsSync(pathFile);

    let continueOverride = true;

    if (fileExist) {
      let continuePromptResult = await (0, _prompts.default)({
        type: 'confirm',
        name: 'value',
        message: 'File already exists, continue?',
        initial: false
      });
      continueOverride = continuePromptResult.value;
      if (!continueOverride) console.log(_chalk.default.yellow('Relax, you skipped file!'));
    }

    return continueOverride;
  }

  setCommand(commandArg) {
    this.commandArg = commandArg;
    this.command = this.config.commands[this.commandArg];

    if (!this.command) {
      throw new Error(_chalk.default.yellow(`Command >${this.commandArg}< not found. See your terun.[env].json`));
    }

    if (!(0, _util.validObjectThrow)(this.command, ['transport'])) throw new Error(_chalk.default.yellow(`Transport not defined in command`));
  }

  setOverrideAll(overrideAll) {
    this.overrideAll = overrideAll ? true : false;
  }

  getGlobalArgs(globalArgs) {
    if (globalArgs.length > 0) console.log(_chalk.default.magenta('GLOBAL args:'));
    return new Promise((resolve, reject) => {
      _prompt.default.start();

      _prompt.default.get(globalArgs, (err, result) => {
        resolve(result);
      });
    });
  }

} // Utils


var _default = Make;
exports.default = _default;