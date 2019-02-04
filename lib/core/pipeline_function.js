"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _configManager = _interopRequireDefault(require("./configManager"));

var _util = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Caso seja necessário adicionais mais funções default adicione em `default_functions`
let custom_functions = _configManager.default.getPipelineFunctionsFile();

let default_functions = {
  upper: function upper(value) {
    return value.toUpperCase();
  },
  lower: function lower(value) {
    return value.toLowerCase();
  },
  underscore: function underscore(value) {
    return (0, _util.underscore)(value);
  },
  firstlower: function firstlower(value) {
    return (0, _util.firstLower)(value);
  },
  capitalize: function capitalize(value) {
    return (0, _util.capitalize)(value);
  },
  clearwhitespace: function clearwhitespace(value) {
    return (0, _util.clearWhitespace)(value);
  }
};

if (custom_functions) {
  default_functions = Object.assign(default_functions, custom_functions);
}

var _default = default_functions;
exports.default = _default;