"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMissingProperties = getMissingProperties;
exports.underscore = underscore;
exports.clearWhitespace = clearWhitespace;
exports.createDir = createDir;
exports.logError = logError;
exports.isFileString = isFileString;
exports.isString = isString;
exports.removeFileNameInPath = removeFileNameInPath;
exports.capitalize = capitalize;
exports.firstLower = firstLower;
exports.pluralName = pluralName;
exports.getFile = getFile;
exports.nullOrUndefined = nullOrUndefined;
exports.flatArray = flatArray;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function getMissingProperties(object, args) {
  if (nullOrUndefined(object) || nullOrUndefined(args)) return [];
  return args.filter(arg => {
    let has = object.hasOwnProperty(arg);
    return !has;
  });
}

;

function underscore(value) {
  if (nullOrUndefined(value)) return '';
  value = clearWhitespace(value);
  value = firstLower(value);

  let put_underscore = letter => {
    if (letter.match(/[A-Z]/g)) {
      return `_${letter.toLowerCase()}`;
    } else {
      return letter;
    }
  };

  return value.split('').map(put_underscore).join('');
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
  return value.trim().match(/\w+\.\w+/);
}

function isString(value) {
  if (nullOrUndefined(value)) return false;
  return typeof value === 'string';
}

function removeFileNameInPath(path) {
  if (nullOrUndefined(path)) return '';
  let splittedPath = [];

  if (isString(path)) {
    splittedPath = path.split('/');
    if (!splittedPath) return '';
  } else {
    splittedPath = path;
  }

  let isFolder = value => !isFileString(value);

  let withoutFilenameArray = splittedPath.filter(isFolder);
  if (!withoutFilenameArray) return '';
  return withoutFilenameArray.join('/');
}

function capitalize(text) {
  if (nullOrUndefined(text)) return '';
  return text.replace(/^\w/, c => c.toUpperCase());
}

function firstLower(text) {
  if (nullOrUndefined(text)) return '';

  let _text = _toArray(text),
      head = _text[0],
      tail = _text.slice(1);

  if (!head) return '';
  head = head.toLowerCase();
  tail = tail.join('');
  return head + tail;
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