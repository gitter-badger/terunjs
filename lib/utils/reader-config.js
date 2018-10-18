"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig(env) {
  try {
    return require(`${process.cwd()}/terun.${env}.json`);
  } catch (e) {
    console.log(_chalk.default.red('Error in get config terun.json'));
    return null;
  }
}

var _default = {
  getConfig
};
exports.default = _default;