"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const PROPERTIES_WITH_VALIDATIONS = /(@.*?)\((.*)\)|(private|public|protected)(?!.*function)[\s\w].*/g;
const PROPERTIES_REPLACE = /(public|private|protected)\s|;|\$/g;
const PROPERTIES = /((private|public|protected)\s\$\w+;)/g;
const CLASS_NAME = /(class\s[a-zA-z]+)/g;
const CLASS_NAME_REPLACE = /(class\s[a-zA-z]+)/g;
var _default = {
  PROPERTIES_WITH_VALIDATIONS,
  PROPERTIES_REPLACE,
  PROPERTIES,
  CLASS_NAME,
  CLASS_NAME_REPLACE
};
exports.default = _default;