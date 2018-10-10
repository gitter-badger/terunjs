"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _chalk = _interopRequireDefault(require("chalk"));

var _util = require("../util");

var _prompt = _interopRequireDefault(require("prompt"));

var _mustache = _interopRequireDefault(require("mustache"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderFile(args, globalArgs, prompt_result, from_file) {
  let content = _fs.default.readFileSync(from_file, 'utf8');

  if (!content) throw new Error('File not found');
  let obj_args = getArgsFromObject(args, prompt_result); // RENDER final file

  return _mustache.default.render(content, Object.assign(obj_args, globalArgs) || {});
}

function getArgsFromObject(args, objectToGetArg) {
  return args.reduce((ant, prox) => {
    let object_to_assign = {};
    object_to_assign[prox] = objectToGetArg[prox];
    return Object.assign(ant, object_to_assign);
  }, {});
}

function getTransport(config, transport, globalArgs) {
  return new Promise((resolve, reject) => {
    _prompt.default.start();

    _prompt.default.get(transport.args, function (err, result) {
      let base_dir = `${process.cwd()}${config.base_dir}`;
      let from_file = `${base_dir}${transport.from}`;
      let to_file = `${base_dir}${transport.to}`; // render file name with mustache js

      let argsToParseView = getArgsFromObject(transport.args, result);
      let argsViewWithGlobal = Object.assign(argsToParseView, globalArgs);

      let to_file_rendered = _mustache.default.render(to_file, argsViewWithGlobal || {}); // render final file


      let rendered_file = renderFile(transport.args, globalArgs, result, from_file);

      _fs.default.writeFile(to_file_rendered, rendered_file, {
        flag: 'wx'
      }, err => {
        if (err) throw new Error(`Path > ${to_file_rendered} < not found`);
        resolve();
      });
    });
  });
}

function getGlobalArgs(command_select) {
  let globalCommandArgs = command_select.args;
  if (globalCommandArgs && globalCommandArgs.length > 0) console.log(_chalk.default.magenta('set GLOBAL args: '));
  return new Promise((resolve, reject) => {
    _prompt.default.start();

    _prompt.default.get(globalCommandArgs, function (err, result) {
      resolve(getArgsFromObject(globalCommandArgs, result));
    });
  });
}

async function init(config, command) {
  let errorsBaseConfig = (0, _util.validParameter)(config, ['base_dir', 'commands']);

  if (errorsBaseConfig && errorsBaseConfig.length > 0) {
    return errorsBaseConfig.forEach(error => (0, _util.logError)(`Not found parameter ${error}`));
  }

  ;
  let command_select = config.commands[command];
  if (!command_select) return (0, _util.logError)(`Not found command > ${command} <`); //load global args COMMAND

  let globalArgs = await getGlobalArgs(command_select); // INIT

  for (let transport of command_select.transport) {
    let errorParametersTransport = (0, _util.validParameter)(transport, ['from', 'to', 'args']);

    if (errorParametersTransport && errorParametersTransport.length > 0) {
      return errorParametersTransport.forEach(error => (0, _util.logError)(`Not found parameter ${error}`));
    }

    ;
    console.log(_chalk.default.magenta(`process: ${transport.from}`));
    await getTransport(config, transport, globalArgs);
  }

  console.log(_chalk.default.green("Success!"));
}

var _default = init;
exports.default = _default;