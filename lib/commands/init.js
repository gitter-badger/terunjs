"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("../utils/util");

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function init() {
  let content = await _fs.default.readFileSync(__dirname + '/../resource/config.json', 'utf-8');
  await _fs.default.writeFileSync(`${process.cwd()}/terun.default.json`, content);
}

var _default = init;
exports.default = _default;