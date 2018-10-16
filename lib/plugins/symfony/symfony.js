"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.match");

var _util = require("../../utils/util");

var _helper = require("./helper");

var _regex = _interopRequireDefault(require("./regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SymfonyEntity {
  constructor() {
    this.name = "symfony:entity-form";
    this.configuration = {};
    this.content = '';
  }

  async config(config, globalArgs, render) {
    let configAssign = Object.assign({}, config);
    if (!configAssign.from) throw new Error(`>>From<< not defined`);
    this.configuration = {
      from: render.renderSimple(configAssign.from, globalArgs),
      name: configAssign.name
    };
    this.content = await (0, _util.getFile)(this.configuration.from);
  }

  async beforeRender(objectToSetArgs = {}) {
    // set helpers
    objectToSetArgs['s:class_lower'] = (await this.getClassName()).toLowerCase();
    objectToSetArgs['s:class_cap'] = (0, _util.capitalize)((await this.getClassName()));
    objectToSetArgs['s:class_plural_lower'] = (0, _util.pluralName)((await this.getClassName())).toLowerCase();
    objectToSetArgs['s:class_plural_cap'] = (0, _util.capitalize)((0, _util.pluralName)((await this.getClassName()))); // set parameters

    objectToSetArgs['symfony-form-builder'] = await this.getForm();
    objectToSetArgs['symfony-entity-props'] = await this.getEntityPropertiesToView();
    objectToSetArgs['symfony-entity-get-entity-print-codes'] = await this.getEntityPrintCodes(objectToSetArgs['s:class_lower'] || '');
    objectToSetArgs['symfony-entity-props-counter'] = (await this.getPropertiesCounter()) + 1;
    return objectToSetArgs;
  }

  async getProperties() {
    let properties = this.content.match(_regex.default.PROPERTIES);
    let clearProperties = properties.map(propertie => {
      let cleared = propertie.replace(_regex.default.PROPERTIES_REPLACE, '');
      return cleared;
    });
    return clearProperties;
  }

  async getClassName() {
    let classNameMatchs = this.content.match(_regex.default.CLASS_NAME);
    if (!classNameMatchs) return '';
    if (classNameMatchs && classNameMatchs.length == 0) return '';
    let className = classNameMatchs[0].replace(_regex.default.CLASS_NAME_REPLACE, '');
    return className;
  }

  async getPropertiesCounter() {
    let propriedades = await this.getProperties();
    let counter = propriedades ? propriedades.length : 0;
    return counter;
  }

  async getEntityPropertiesToView() {
    let properties = await this.getProperties();
    properties = properties.map(propertie => `${(0, _util.capitalize)(propertie)}`);
    return properties;
  }

  async getForm() {
    let properties = await this.getProperties();

    let renderForm = properties => {
      return properties.reduce((ant, act) => {
        if (!ant) return ant + `add('${act}')`;
        return ant + `->add('${act}')`;
      }, '');
    };

    let renderedForm = `$builder->${renderForm(properties)};`;
    return renderedForm;
  }

  async _getPropertiesWithValidations() {
    /**
     * [
     *      {
     *          "propertie":"id",
     *          "validations":[
     *              '@ORMId()'
     *              '@ORMGeneratedValue()'
     *          ]
     *      }
     * ]
     */
    let regex = _regex.default.PROPERTIES_WITH_VALIDATIONS;
    let matchs = this.content.match(regex);
    if (!matchs) return [];
    let properties = [];
    let objectPropertie = {
      propertie: "",
      validations: []
    };
    matchs.forEach(match => {
      if ((0, _helper.isAnnotation)(match)) {
        objectPropertie.validations = [...objectPropertie.validations, match];
        return;
      }

      objectPropertie.propertie = match.replace(_regex.default.PROPERTIES_REPLACE, '');
      properties = [...properties, objectPropertie];
      objectPropertie = {
        propertie: "",
        validations: []
      };
    });
    return properties;
  }

  async getEntityPrintCodes(name_entity) {
    let properties = await this.getProperties();
    properties = properties.map(propertie => `${name_entity}.${propertie}`);
    return properties;
  }

}

var _default = SymfonyEntity;
exports.default = _default;