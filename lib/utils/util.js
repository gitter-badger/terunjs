"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMissingProperties = getMissingProperties;
exports.underscore = underscore;
exports.split = split;
exports.clearWhitespace = clearWhitespace;
exports.createDir = createDir;
exports.logError = logError;
exports.isFileString = isFileString;
exports.hasMatch = hasMatch;
exports.trim = trim;
exports.isString = isString;
exports.removeFileNameInPath = removeFileNameInPath;
exports.replace = replace;
exports.capitalize = capitalize;
exports.firstLower = firstLower;
exports.lowerCase = lowerCase;
exports.upperCase = upperCase;
exports.pluralName = pluralName;
exports.getFile = getFile;
exports.nullOrUndefined = nullOrUndefined;
exports.flatArray = flatArray;
exports.fn = void 0;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.regexp.match");

var _chalk = _interopRequireDefault(require("chalk"));

var _pluralizePtbr = _interopRequireDefault(require("pluralize-ptbr"));

var _fs = _interopRequireDefault(require("fs"));

var _mkdirRecursive = _interopRequireDefault(require("mkdir-recursive"));

var _funclize = _interopRequireDefault(require("./funclize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const fn = {
  filter: (0, _funclize.default)(Array.prototype.filter),
  map: (0, _funclize.default)(Array.prototype.map),
  join: (value, delimiter = '') => (0, _funclize.default)(Array.prototype.join)(value, delimiter)
};
exports.fn = fn;

function getMissingProperties(object, args) {
  var _args;

  if (nullOrUndefined(object) || nullOrUndefined(args)) return [];

  let hasPropertie = value => !object.hasOwnProperty(value);

  return _args = args, ((_arg) => {
    return fn.filter(_arg, hasPropertie);
  })(_args);
}

;

function underscore(value) {
  var _value, _ref, _value2, _ref2, _ref3;

  if (nullOrUndefined(value)) return '';
  value = (_ref = (_value = value, clearWhitespace(_value)), firstLower(_ref));

  let put_underscore = letter => {
    var _letter;

    return letter.match(/[A-Z]/g) ? `_${(_letter = letter, lowerCase(_letter))}` : letter;
  };

  return _ref3 = (_ref2 = (_value2 = value, split(_value2)), ((_arg2) => {
    return fn.map(_arg2, put_underscore);
  })(_ref2)), fn.join(_ref3);
}

function split(value, delimiter = '') {
  if (nullOrUndefined(value)) return [];
  return value.split(delimiter);
}

function clearWhitespace(value) {
  if (nullOrUndefined(value)) return '';
  return value.replace(/\s+/g, '');
}

async function createDir(to) {
  let dirToCreate = `${removeFileNameInPath(to)}`;
  return await _mkdirRecursive.default.mkdirSync(dirToCreate);
}

function logError(message) {
  if (nullOrUndefined(message)) return '';
  return console.log(_chalk.default.red(message));
}

function isFileString(value) {
  var _value3, _ref4;

  if (nullOrUndefined(value)) return '';
  return _ref4 = (_value3 = value, trim(_value3)), ((_arg3) => {
    return hasMatch(_arg3, /\w+\.\w+/);
  })(_ref4);
}

function hasMatch(value, regex) {
  if (nullOrUndefined(value)) return '';
  if (nullOrUndefined(regex)) return '';
  return value.match(regex);
}

function trim(value) {
  if (nullOrUndefined(value)) return '';
  return value.trim();
}

function isString(value) {
  if (nullOrUndefined(value)) return false;
  return typeof value === 'string';
}

function removeFileNameInPath(path) {
  var _splittedPath, _withoutFilenameArray;

  if (nullOrUndefined(path)) return '';
  let splittedPath = [];

  if (isString(path)) {
    splittedPath = path.split('/');
    if (!splittedPath) return '';
  } else {
    splittedPath = path;
  }

  let isFolder = value => !isFileString(value);

  let withoutFilenameArray = (_splittedPath = splittedPath, ((_arg4) => {
    return fn.filter(_arg4, isFolder);
  })(_splittedPath));
  if (!withoutFilenameArray) return '';
  return _withoutFilenameArray = withoutFilenameArray, ((_arg5) => {
    return fn.join(_arg5, '/');
  })(_withoutFilenameArray);
}

function replace(value, search, replace) {
  if (nullOrUndefined(value)) return '';
  if (nullOrUndefined(search)) return '';
  if (nullOrUndefined(replace)) return '';
  return value.replace(search, replace);
}

function capitalize(text) {
  var _text;

  if (nullOrUndefined(text)) return '';
  return _text = text, ((_arg6) => {
    return replace(_arg6, /^\w/, upperCase);
  })(_text);
}

function firstLower(text) {
  var _head, _tail;

  if (nullOrUndefined(text)) return '';

  let _text2 = _toArray(text),
      head = _text2[0],
      tail = _text2.slice(1);

  if (!head) return '';
  head = (_head = head, lowerCase(_head));
  tail = (_tail = tail, fn.join(_tail));
  return head + tail;
}

function lowerCase(text) {
  if (nullOrUndefined(text)) return '';
  return text.toLowerCase();
}

function upperCase(text) {
  if (nullOrUndefined(text)) return '';
  return text.toUpperCase();
}

function pluralName(text) {
  if (nullOrUndefined(text)) return '';
  return (0, _pluralizePtbr.default)(text);
}

async function getFile(path) {
  if (nullOrUndefined(path)) return null;

  try {
    let content = _fs.default.readFileSync(path, 'utf-8');

    return content;
  } catch (e) {
    return null;
  }
}

function nullOrUndefined(value) {
  return value == null || value == undefined;
}

function flatArray(array, depth = 1) {
  if (nullOrUndefined(array)) return [];
  if (!Array.isArray(array)) return [];
  return array.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) && depth - 1 ? flatArray(toFlatten, depth - 1) : toFlatten);
  }, []);
}