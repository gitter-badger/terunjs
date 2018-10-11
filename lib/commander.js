"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _commander = _interopRequireDefault(require("commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander.default.version('0.0.1').option('--make [env] [command](optional)', 'Make a crud with a config file (terun.js)').parse(process.argv);

var _default = _commander.default;
exports.default = _default;