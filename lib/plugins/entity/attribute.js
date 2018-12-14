"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

var _entityManager = _interopRequireDefault(require("./entityManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Attribute {
  constructor(configPlugin, baseDir, render, options = {}) {
    this.configurationPlugin = configPlugin;
    this.baseDir = baseDir;
    this.render = render;
    this.configuration = {};
    this.fileExtensionPath = '';
    this.baseDirFields = '';
    this.defaultValues = {};
    this.options = {};
    this.type = '';
    this.isReference = options.reference ? true : false;
    this.typeReference = undefined;
    this.reference = undefined;
    this.avaliableTypesReference = ['hasMany', 'belongsToMany', 'hasOne', 'belongsToOne'];
  }

  loadConfig() {
    if (!this.configurationPlugin.field.config) return;
    this.configuration = JSON.parse(_fs.default.readFileSync(`${this.baseDirFields}/${this.configurationPlugin.field.config}.json`, 'utf-8'));
    this.setDefaultValues(this.configuration.defaultValues || {});
  }

  setDefaultValues(defaultValues) {
    Object.keys(defaultValues).forEach(key => {
      let attributeExists = Object.getOwnPropertyDescriptor(this.options, key);
      let valueKey = defaultValues[key];

      if (!attributeExists) {
        this.options[key] = valueKey;
      }
    });
  }

  fromJson(json, name) {
    this.name = name;
    if (typeof json != "object") json = JSON.parse(json);

    if (!json.type) {
      console.log(_chalk.default.red(`>>type<< not found in attribute`));
      throw new Error('Type not found in attribute');
    }

    this.type = json.type;
    this.options = json;

    if (this.options.reference) {
      this.getReference(this.type, this.options.reference);
    }

    this.baseDirFields = `${this.baseDir}${this.configurationPlugin.field.dir}`;
    this.fileExtensionPath = `${this.baseDirFields}/${this.type}.${this.configurationPlugin.field.extension}`;

    if (!this.resolveTypeFile()) {
      console.log(_chalk.default.red(`File ${this.type}.${this.configurationPlugin.field.extension || ''} type attribute not found.`));
      throw new Error('File not found');
    }

    this.loadConfig();
  }

  getReference(type, options) {
    if (this.isReference) return;

    if (!options.entity) {
      console.log(_chalk.default.red(`>>entity<< not found in reference`));
      throw new Error('Entity not found in reference');
    }

    if (!this.avaliableTypesReference.includes(type)) {
      console.log(_chalk.default.red(`>>type<< not found in avaliables types`));
      throw new Error('Type not found in avaliables types');
    }

    let referenceEntity = _fs.default.readFileSync(`${this.baseDir}${this.configurationPlugin.entity_dir}/${options.entity}.json`, 'utf-8');

    this.reference = new _entityManager.default(this.configurationPlugin, this.baseDir, this.render, {
      reference: true
    });
    this.reference.fromJson(referenceEntity);
    this.isReference = true;
    this.typeReference = type;
  }

  resolveTypeFile() {
    return _fs.default.existsSync(this.fileExtensionPath);
  }

  getRenderedAttribute(reference) {
    return this.render.renderFile(this.fileExtensionPath, _objectSpread({
      name: this.name
    }, this.options, {
      reference
    }));
  }

}

var _default = Attribute;
exports.default = _default;