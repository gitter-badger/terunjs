"use strict";

require("core-js/modules/es6.regexp.split");

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

exports.dropFileName = to => {
  let splitted = to.split('/');
  if (!splitted) return "";
  let withoutFilenameArray = splitted.slice(0, splitted.length - 1) || "";
  if (!withoutFilenameArray) return "";
  return withoutFilenameArray.join('/');
};