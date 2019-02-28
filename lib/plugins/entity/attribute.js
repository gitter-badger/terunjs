"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/web.dom.iterable");

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

var _entityManager = _interopRequireDefault(require("./entityManager"));

var _util = require("../../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

class Attribute {
  constructor(configPlugin, baseDir, render, options = {}) {
    this.configurationPlugin = configPlugin;
    this.baseDir = baseDir;
    this.render = render;
    this.configuration = {};
    this.fileTypePath = '';
    this.baseDirFields = '';
    this.options = {};
    this.type = '';
    this.isReference = options && options.reference ? true : false;
    this.typeReference = undefined;
    this.reference = undefined;
    this.avaliableTypesReference = ['hasMany', 'belongsToMany', 'hasOne', 'belongsToOne'];
  }

  setConfig(configContent) {
    this.configuration = configContent;
    this.setDictionary(this.configuration.dictionary || {});
    if (this.configuration.defaultValues) this.setDefaultValues(this.configuration.defaultValues.attribute || {});
  }

  setDefaultValues(defaultValues = {}) {
    if ((0, _util.nullOrUndefined)(defaultValues)) return;
    Object.keys(defaultValues).forEach(key => {
      let attributeExists = Object.getOwnPropertyDescriptor(this.options, key);
      let valueKey = defaultValues[key];

      if (!attributeExists) {
        this.options[key] = valueKey;
      }
    });
  }

  setDictionary(dictionary) {
    let getLanguage = key => ({
      language: key,
      keys: dictionary[key]
    });

    let getValueFromType = type => ({
      language,
      keys
    }) => ({
      language: language,
      value: keys[type]
    });

    let setValuesInInstance = ({
      language,
      value
    }) => {
      this[`type:${language}`] = value;
    };

    Object.keys(dictionary).map(getLanguage).map(getValueFromType(this.type)).forEach(setValuesInInstance);
  }

  import(contentFile, name) {
    this.name = name;

    if (!contentFile.type) {
      console.log(_chalk.default.red(`TYPE not found in attribute`));
      throw new Error('Type not found in attribute');
    }

    if (!contentFile.field && this.configuration.field) {
      console.log(_chalk.default.yellow(`FIELD not found in attribute (${this.name}). TYPE will be define to working in THIS field`));
    }

    this.type = contentFile.type;
    this.field = contentFile.field;
    this.options = contentFile;

    if (this.options.reference) {
      this.getReference(this.options.reference);
    } else {
      this.field = this.type;
    }

    if (this.configurationPlugin && this.configurationPlugin.field) {
      this.baseDirFields = `${this.baseDir}${this.configurationPlugin.field.dir}`;
      this.fileTypePath = `${this.baseDirFields}/${this.field}.${this.configurationPlugin.field.extension}`;
    }

    if (this.configurationPlugin && this.configurationPlugin.field) {
      if (!this.resolveTypeFile()) {
        console.log(_chalk.default.red(`File ${this.field}.${this.configurationPlugin.field.extension || ''} field attribute not found.`));
        throw new Error('File not found');
      }
    }
  }

  getReference(options) {
    if (this.isReference) return;

    if (typeof options == 'string') {
      let _options$split = options.split('|'),
          _options$split2 = _slicedToArray(_options$split, 2),
          entity = _options$split2[0],
          relationship = _options$split2[1];

      options = {};
      options.entity = entity.trim();
      options.relationship = relationship.trim();
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

    let referenceEntity = require(`${this.baseDir}${this.configurationPlugin.entity_dir}/${options.entity}.js`);

    this.reference = new _entityManager.default(this.configurationPlugin, this.baseDir, this.render, {
      reference: true
    });
    this.reference.import(referenceEntity);
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