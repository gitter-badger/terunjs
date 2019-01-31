"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPipeFunctions(env) {
  try {
    return require(`${process.cwd()}/config/pipes.js`);
  } catch (e) {
    console.log(_chalk.default.red('Error in get config pipes.js'));
    return null;
  }
}

var _default = {
  getPipeFunctions
};
exports.default = _default;