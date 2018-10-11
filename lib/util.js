"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.validParameter = (object, args) => {
  return args.filter(arg => {
    let has = object.hasOwnProperty(arg);
    return !has;
  });
};

exports.logError = message => {
  return console.log(_chalk.default.red(message));
};