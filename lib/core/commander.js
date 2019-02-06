"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _commander = _interopRequireDefault(require("commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _package = require('../../package.json');

_commander.default.version(_package.version).option('--make [command](optional)', 'Make a crud with a config file (terun.default.js)').option('--init', 'Make a config file').option('--env', 'Set your env file').option('--version', 'See Terun version').parse(process.argv);

var _default = _commander.default;
exports.default = _default;