"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _attribute = _interopRequireDefault(require("./attribute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EntityManager {
  constructor(config, baseDir, render, options = {}) {
    this.configuration = config;
    this.name = '';
    this.attributes = [];
    this.baseDir = baseDir;
    this.render = render;
    this.custom = {};
    this.isReference = options.reference ? true : false;
  }

  fromJson(json) {
    json = JSON.parse(json);
    let schema = json.schema;
    this.name = schema.name;
    this.custom = schema.custom ? schema.custom : {};
    if (this.isReference) return;
    this.attributes = Object.keys(schema.attributes).map(attributeKey => {
      let attribute = new _attribute.default(this.configuration, this.baseDir, this.render);
      attribute.fromJson(schema.attributes[attributeKey], attributeKey);
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