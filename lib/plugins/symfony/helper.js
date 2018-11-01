"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnnotation = isAnnotation;

require("core-js/modules/es6.regexp.constructor");

function isAnnotation(value) {
  let regexAnnotation = new RegExp('(@.*?)', 'g');
  return regexAnnotation.test(value);
}