"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mustache = _interopRequireDefault(require("mustache"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Render {
  constructor(customTags = ['{{', '}}']) {
    this.template = _mustache.default;
    this.customTags = customTags;

    this.template.escape = function (text) {
      return text;
    };
  } // RENDER final file


  renderFile(from_file, argsToRender = {}) {
    let content = _fs.default.readFileSync(from_file, 'utf8');

    if (!content) throw new Error('File not found or file empty');
    return this.template.render(content, argsToRender, {}, this.customTags);
  }

  renderSimple(content, argsToRender = {}, customTags) {
    return this.template.render(content, argsToRender, {}, customTags || this.customTags);
  }

}

var _default = Render;
exports.default = _default;