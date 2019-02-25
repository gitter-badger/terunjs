"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mustache = _interopRequireDefault(require("./mustache"));

var _fs = _interopRequireDefault(require("fs"));

var _pipeline_function = _interopRequireDefault(require("./pipeline_function"));

var _util = require("../utils/util");

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
    var _argsToRender;

    if ((0, _util.nullOrUndefined)(argsToRender)) return null;

    let content = _fs.default.readFileSync(from_file, 'utf8');

    if (!content) throw new Error('File not found or file empty');
    argsToRender = (_argsToRender = argsToRender, this._mergePipeline(_argsToRender));
    return this.template.render(content, argsToRender, {}, this.customTags);
  }

  renderSimple(content, argsToRender = {}, customTags) {
    var _argsToRender2;

    if ((0, _util.nullOrUndefined)(argsToRender)) return null;
    argsToRender = (_argsToRender2 = argsToRender, this._mergePipeline(_argsToRender2));
    return this.template.render(content, argsToRender, {}, customTags || this.customTags);
  }

  _mergePipeline(object) {
    return Object.assign(object, _pipeline_function.default);
  }

}

var _default = Render;
exports.default = _default;