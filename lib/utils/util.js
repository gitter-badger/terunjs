"use strict";

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.split");

var _chalk = _interopRequireDefault(require("chalk"));

var _pluralizePtbr = _interopRequireDefault(require("pluralize-ptbr"));

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

exports.capitalize = text => {
  return text.replace(/^\w/, c => c.toUpperCase());
};

exports.pluralName = text => {
  return (0, _pluralizePtbr.default)(text);
};