"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _entityManager = _interopRequireDefault(require("./entityManager"));

var _chalk = _interopRequireDefault(require("chalk"));

var _promptCheckbox = _interopRequireDefault(require("prompt-checkbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Entity {
  constructor() {
    this.name = 'entity';
    this.configuration = {};
    this.files = [];
    this.fileInUse = undefined;
    this.entity = undefined;
    this.transportFiles = [];
    this.entitys = [];
  }

  async config(configPlugin, globalArgs, render, baseConfig, transportFiles) {
    let configAssign = Object.assign({}, configPlugin);
    this.baseDir = `${process.cwd()}${baseConfig}/`;
    if (!configAssign.entity_dir) throw new Error('>>entity_dir<< not defined');
    if (configAssign.field && !configAssign.field.dir) throw new Error('>>field.dir<< not defined');
    if (configAssign.field && !configAssign.field.extension) throw new Error('>>field.extension<< not defined');
    this.configuration = configAssign;
    this.files_to_work = await this.getFilesEntityFolder();
    this.transportFiles = transportFiles;
    this.render = render;
    this.entitys = this.getEntitysConfig();
  }

  getEntitysConfig() {
    let files = this.files_to_work;
    return files.map(file => {
      return JSON.parse(_fs.default.readFileSync(`${this.baseDir}${this.configuration.entity_dir}/${file}`, 'utf-8'));
    });
  }

  async getFilesEntityFolder() {
    let files = _fs.default.readdirSync(`${this.baseDir}/${this.configuration.entity_dir}`);

    let promptFiles = new _promptCheckbox.default({
      name: 'files',
      radio: true,
      message: 'Choise the files to resolve:',
      choices: files
    });
    return await promptFiles.run();
  }

  async initTransport() {
    if (this.files.length === 0) this.files = [...this.files_to_work];
    this.fileInUse = this.files.shift();
    console.log(_chalk.default.green(`Plugin:${this.name} process file ${this.fileInUse}`));

    let entityJson = _fs.default.readFileSync(`${this.baseDir}${this.configuration.entity_dir}/${this.fileInUse}`, 'utf-8');

    this.entity = new _entityManager.default(this.configuration, this.baseDir, this.render);
    this.entity.fromJson(entityJson);
  }

  async beforeRender(objectToSetArgs = {}) {
    objectToSetArgs[`${this.name}:name`] = this.entity.name;
    objectToSetArgs[`${this.name}:forms`] = this.entity.getRenderedAttributes();
    objectToSetArgs[`${this.name}:files`] = this.files_to_work;
    objectToSetArgs[`${this.name}:entitys_config`] = this.entitys;
    objectToSetArgs[`${this.name}:references`] = this.entity.getReferences();
    objectToSetArgs[`${this.name}:attributes`] = this.entity.attributes;
    objectToSetArgs[`${this.name}:custom`] = this.entity.custom;
    return objectToSetArgs;
  }

  async doneRender(loop = false) {
    let hasFiles = !this.files.length == 0;
    loop = hasFiles;
    return {
      loop
    };
  }

}

var _default = Entity;
exports.default = _default;