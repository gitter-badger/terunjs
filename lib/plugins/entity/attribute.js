"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Attribute {
  constructor(config, baseDir, render) {
    this.configuration = config;
    this.baseDir = baseDir;
    this.render = render;
  }

  fromJson(json) {
    this.name = json.name;
    this.maxlength = json.maxlength || 50;
    this.required = json.required ? true : false;
    this.placeholder = json.placeholder || '';
    this.type = json.type || 'text';
    this.label = json.label || '';
    this.fileDir = `${this.baseDir}${this.configuration.field_dir}/${this.type}.${this.configuration.field_extension}`;

    if (!this.resolveTypeFile(this.type)) {
      console.log(_chalk.default.red(`File ${this.type}.${this.configuration.field_extension || ''} type attribute not found.`));
      throw new Error('File not found');
    }
  }

  resolveTypeFile(type) {
    return _fs.default.existsSync(this.fileDir);
  }

  getRenderedAttribute(entity) {
    return this.render.renderFile(this.fileDir, _objectSpread({}, this, {
      entity
    }));
  }

}

var _default = Attribute;
exports.default = _default;