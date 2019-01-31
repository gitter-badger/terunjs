"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.split");

var _mustache = _interopRequireDefault(require("mustache"));

var _pipe_function = _interopRequireDefault(require("./pipe_function.js"));

var _chalk = _interopRequireDefault(require("chalk"));

var _util = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

_mustache.default.Writer.prototype.splitPipe = function (value) {
  const pipe = "|";

  let trim = string => string.trim();

  if (value.includes(pipe)) return value.split(pipe).map(trim);
  return [value];
};

_mustache.default.Writer.prototype.pipe = function (value, pipes) {
  if (value == null) return value;
  return pipes.reduce((ant, functionName) => {
    if (_pipe_function.default.hasOwnProperty(functionName)) {
      return _pipe_function.default[functionName](ant);
    }

    (0, _util.logError)(`Pipeline >${functionName}<< not found.`);
    return ant;
  }, value);
};

_mustache.default.Writer.prototype.escapedValue = function escapedValue(token, context) {
  let _token = _slicedToArray(token, 2),
      tokenValue = _token[1];

  let _this$splitPipe = this.splitPipe(tokenValue),
      _this$splitPipe2 = _toArray(_this$splitPipe),
      name = _this$splitPipe2[0],
      pipes = _this$splitPipe2.slice(1);

  let contextValue = context.lookup(name);
  let finalValue = this.pipe(contextValue, pipes);
  if (finalValue != null) return _mustache.default.escape(finalValue);
};

var _default = _mustache.default;
exports.default = _default;