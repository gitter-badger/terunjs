"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mustache = _interopRequireDefault(require("mustache"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Render {
  constructor(custom_tags = ['{{', '}}']) {
    this.template = _mustache.default;
    this.custom_tags = custom_tags;
  } // RENDER final file


  renderFile(from_file, args_to_render = {}) {
    let content = _fs.default.readFileSync(from_file, 'utf8');

    if (!content) throw new Error('File not found or file empty');
    return this.template.render(content, args_to_render, {}, this.custom_tags);
  }

  renderSimple(content, args_to_render = {}, custom_tags) {
    return this.template.render(content, args_to_render, {}, custom_tags || this.custom_tags);
  }

}

var _default = Render;
exports.default = _default;