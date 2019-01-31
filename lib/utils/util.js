"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.split");

var _chalk = _interopRequireDefault(require("chalk"));

var _pluralizePtbr = _interopRequireDefault(require("pluralize-ptbr"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  if (!splitted) return '';
  let withoutFilenameArray = splitted.slice(0, splitted.length - 1) || '';
  if (!withoutFilenameArray) return '';
  return withoutFilenameArray.join('/');
};

exports.capitalize = text => {
  return text.replace(/^\w/, c => c.toUpperCase());
};

exports.firstLower = value => {
  let _value = _toArray(value),
      head = _value[0],
      tail = _value.slice(1);

  head = head.toLowerCase();
  tail = tail.join('');
  return head + tail;
};

exports.pluralName = text => {
  return (0, _pluralizePtbr.default)(text);
};

exports.getFile = async from => {
  let baseDir = `${process.cwd()}/${from}`;
  let content = await _fs.default.readFileSync(baseDir, 'utf-8');
  return content;
};

exports.flatArray = (array, depth = 1) => {
  return array.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) && depth - 1 ? toFlatten.flat(depth - 1) : toFlatten);
  }, []);
};