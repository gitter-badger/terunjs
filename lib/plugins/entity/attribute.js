"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

require("core-js/modules/web.dom.iterable");

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

var _entityManager = _interopRequireDefault(require("./entityManager"));

var _configManager = _interopRequireDefault(require("../../core/configManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Attribute {
  constructor(configPlugin, baseDir, render, options = {}) {
    this.configurationPlugin = configPlugin;
    this.baseDir = baseDir;
    this.render = render;
    this.configuration = {};
    this.fileTypePath = '';
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
    if (this.configurationPlugin.field) {
      this.configuration = _configManager.default.getConfigFields();
    }

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
      console.log(_chalk.default.red(`TYPE not found in attribute`));
      throw new Error('Type not found in attribute');
    }

    if (!json.field && this.configuration.field) {
      console.log(_chalk.default.yellow(`FIELD not found in attribute (${this.name}). TYPE will be define to working in THIS field`));
    }

    this.type = json.type;
    this.field = json.field;
    this.options = json;

    if (this.options.reference) {
      this.getReference(this.options.reference);
    } else {
      this.field = this.type;
    }

    if (this.configurationPlugin.field) {
      this.baseDirFields = `${this.baseDir}${this.configurationPlugin.field.dir}`;
      this.fileTypePath = `${this.baseDirFields}/${this.field}.${this.configurationPlugin.field.extension}`;
    }

    if (this.configurationPlugin.field) {
      if (!this.resolveTypeFile()) {
        console.log(_chalk.default.red(`File ${this.field}.${this.configurationPlugin.field.extension || ''} field attribute not found.`));
        throw new Error('File not found');
      }
    }

    this.loadConfig();
  }

  getReference(options) {
    if (this.isReference) return;

    if (typeof options == 'string') {
      let optionSlited = options.split('|');
      options = {};
      options.entity = optionSlited[0];
      options.relationship = optionSlited[1];
    }

    if (!options.entity) {
      console.log(_chalk.default.red(`ENTITY not found in reference`));
      throw new Error('Entity not found in reference');
    }

    if (!options.relationship) {
      console.log(_chalk.default.red(`RELATIONSHIP not found in reference`));
      throw new Error('Relationship not found in reference');
    }

    if (!this.avaliableTypesReference.includes(options.relationship)) {
      console.log(_chalk.default.red(`RELATIONSHIP not found in avaliables types`));
      throw new Error('Type not found in avaliables types');
    }

    this.field = this.field ? this.field : options.relationship;

    let referenceEntity = _fs.default.readFileSync(`${this.baseDir}${this.configurationPlugin.entity_dir}/${options.entity}.json`, 'utf-8');

    this.reference = new _entityManager.default(this.configurationPlugin, this.baseDir, this.render, {
      reference: true
    });
    this.reference.fromJson(referenceEntity);
    this.isReference = true;
    this.typeReference = options.relationship;
    return this.reference;
  }

  resolveTypeFile() {
    return _fs.default.existsSync(this.fileTypePath);
  }

  getRenderedAttribute(reference) {
    if (!this.configurationPlugin.field) return '';
    return this.render.renderFile(this.fileTypePath, _objectSpread({
      name: this.name
    }, this.options, {
      reference
    }));
  }

}

var _default = Attribute;
exports.default = _default;