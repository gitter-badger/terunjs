"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _attribute = _interopRequireDefault(require("./attribute"));

var _util = require("../../utils/util");

var _configManager = _interopRequireDefault(require("../../core/configManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EntityManager {
  constructor(config, baseDir, render, options = {}) {
    this.configuration = config;
    this.configurationAttributes = {};
    this.name = '';
    this.attributes = [];
    this.baseDir = baseDir;
    this.render = render;
    this.custom = {};
    this.isReference = options.reference ? true : false;
    this.loadConfig();
  }

  loadConfig() {
    this.configurationAttributes = _configManager.default.getConfigAttributes();
    if (!this.configurationAttributes) return;
    if (!this.configurationAttributes.defaultValues) return;
    if (this.configurationAttributes.defaultValues.custom) this.setDefaultCustomValues(this.configurationAttributes.defaultValues.custom);
  }

  setDefaultCustomValues(defaultValues) {
    var _ref, _ref2, _defaultValues;

    let getKeys = values => Object.keys(values);

    let hasPropertieInObject = object => propertie => Object.getOwnPropertyDescriptor(object, propertie);

    let setKeyInObject = ({
      from,
      to
    }) => key => {
      to[key] = from[key];
      return from[key];
    };

    const _ref3 = setKeyInObject({
      from: defaultValues,
      to: this.custom
    });

    _ref = (_ref2 = (_defaultValues = defaultValues, getKeys(_defaultValues)), ((_arg) => {
      return _util.fn.filter(_arg, propertie => !!hasPropertieInObject(this.custom, propertie));
    })(_ref2)), ((_arg2) => {
      return _util.fn.map(_arg2, _ref3);
    })(_ref);
  }

  import(contentFile) {
    let schema = contentFile.schema;
    this.name = schema.name;
    this.custom = schema.custom ? schema.custom : {};
    if (this.isReference) return;
    this.attributes = Object.keys(schema.attributes).map(attributeKey => {
      let attribute = new _attribute.default(this.configuration, this.baseDir, this.render);
      attribute.import(schema.attributes[attributeKey], attributeKey);
      attribute.setConfig(this.configurationAttributes || {});
      return attribute;
    });
  }

  getRenderedAttributes() {
    return this.attributes.map(attribute => {
      return attribute.getRenderedAttribute(this);
    });
  }

  getReferences() {
    return this.attributes.filter(attribute => {
      return attribute.isReference;
    });
  }

}

var _default = EntityManager;
exports.default = _default;