"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitPipe = splitPipe;
exports.pipe = pipe;

require("core-js/modules/es6.regexp.split");

var _pipeline_function = _interopRequireDefault(require("./pipeline_function.js"));

var _util = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function splitPipe(value) {
  if ((0, _util.nullOrUndefined)(value)) return [];
  const pipe = "|";

  let trim = string => string.trim();

  if (value.includes(pipe)) return value.split(pipe).map(trim);
  return [value];
}

function pipe(value, pipes) {
  if ((0, _util.nullOrUndefined)(value)) return value;
  if ((0, _util.nullOrUndefined)(pipes)) return value;
  return pipes.reduce((ant, functionName) => {
    if (_pipeline_function.default.hasOwnProperty(functionName)) {
      return _pipeline_function.default[functionName](ant);
    }

    (0, _util.logError)(`Pipeline > ${functionName} < not found.`);
    return ant;
  }, value);
}