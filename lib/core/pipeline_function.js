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
    var _value;

    return _value = value, (0, _util.upperCase)(_value);
  },
  lower: function lower(value) {
    var _value2;

    return _value2 = value, (0, _util.lowerCase)(_value2);
  },
  underscore: function underscore(value) {
    var _value3;

    return _value3 = value, (0, _util.underscore)(_value3);
  },
  firstlower: function firstlower(value) {
    var _value4;

    return _value4 = value, (0, _util.firstLower)(_value4);
  },
  capitalize: function capitalize(value) {
    var _value5;

    return _value5 = value, (0, _util.capitalize)(_value5);
  },
  clearwhitespace: function clearwhitespace(value) {
    var _value6;

    return _value6 = value, (0, _util.clearWhitespace)(_value6);
  }
};

if (custom_functions) {
  default_functions = Object.assign(default_functions, custom_functions);
}

var _default = default_functions;
exports.default = _default;