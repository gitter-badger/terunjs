"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SymfonyEntityForm = void 0;

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.match");

var _fs = _interopRequireDefault(require("fs"));

var _util = require("../../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SymfonyEntityForm {
  constructor() {
    this.name = "symfony:entity-form";
    this.configuration = {};
  }

  config(config, argsToFileNameRender, render) {
    let configAssign = Object.assign({}, config);
    if (!configAssign.from) throw new Error(`>>From<< not defined`);
    this.configuration = {
      from: render.renderSimple(configAssign.from, argsToFileNameRender),
      name: configAssign.name
    };
  }

  async beforeRender(objectToSetArgs = {}) {
    // set helpers
    objectToSetArgs['s:class_lower'] = (await this.getClassName()).toLowerCase();
    objectToSetArgs['s:class_cap'] = (0, _util.capitalize)((await this.getClassName()));
    objectToSetArgs['s:class_plural_lower'] = (0, _util.pluralName)((await this.getClassName())).toLowerCase();
    objectToSetArgs['s:class_plural_cap'] = (0, _util.capitalize)((0, _util.pluralName)((await this.getClassName())));
    objectToSetArgs['s:id'] = (0, _util.capitalize)((0, _util.pluralName)((await this.getId()))); // set parameters

    objectToSetArgs['symfony-form-builder'] = await this.getForm();
    objectToSetArgs['symfony-entity-props'] = await this.getEntityPropertiesToView();
    objectToSetArgs['symfony-entity-get-entity-print-codes'] = await this.getEntityPrintCodes(objectToSetArgs['s:class_lower'] || '');
    objectToSetArgs['symfony-entity-props-counter'] = (await this.getPropertiesCounter()) + 1;
    return objectToSetArgs;
  }

  async _getFile() {
    let base_dir = `${process.cwd()}/${this.configuration.from}`;
    let content = await _fs.default.readFileSync(base_dir, 'utf-8');
    return content;
  }

  async getProperties() {
    let content = await this._getFile();
    let properties = content.match(/((private|public|protected)\s\$\w+;)/g);
    let clearProperties = properties.map(propertie => {
      let cleared = propertie.replace(/(public|private|protected)\s|;|\$/g, '');
      return cleared;
    });
    return clearProperties;
  }

  async getClassName() {
    let content = await this._getFile();
    let classNameMatchs = content.match(/(class\s[a-zA-z]+)/g);
    if (classNameMatchs && classNameMatchs.length == 0) return '';
    let className = classNameMatchs[0].replace(/(class|\s)/g, '');
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

  async getEntityPrintCodes(name_entity) {
    let properties = await this.getProperties();
    properties = properties.map(propertie => `${name_entity}.${propertie}`);
    return properties;
  }

}

exports.SymfonyEntityForm = SymfonyEntityForm;