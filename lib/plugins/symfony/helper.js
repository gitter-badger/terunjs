"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnnotation = void 0;

require("core-js/modules/es6.regexp.constructor");

const isAnnotation = value => {
  let regexAnnotation = new RegExp("(@.*?)", 'g');
  return regexAnnotation.test(value);
};

exports.isAnnotation = isAnnotation;