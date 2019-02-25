"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.split");

var _fs = _interopRequireDefault(require("fs"));

var _entityManager = _interopRequireDefault(require("./entityManager"));

var _chalk = _interopRequireDefault(require("chalk"));

var _promptCheckbox = _interopRequireDefault(require("prompt-checkbox"));

var _util = require("../../utils/util");

var _fsReaddirRecursive = _interopRequireDefault(require("fs-readdir-recursive"));

var _util2 = require("../../../lib/utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

class Entity {
  constructor() {
    this.name = 'entity';
    this.configuration = {};
    this.files = [];
    this.fileInUse = undefined;
    this.entity = undefined;
    this.transportFiles = [];
    this.entitys = [];
    this.transport = {};
  }

  async config({
    configPlugin,
    globalArgs,
    render,
    baseConfig,
    transportFiles
  }) {
    let configAssign = Object.assign({}, configPlugin);
    this.baseDir = `${process.cwd()}/`;
    if (!configAssign.entity_dir) throw new Error('>>entity_dir<< not defined');
    if (configAssign.field && !configAssign.field.dir) throw new Error('>>field.dir<< not defined');
    if (configAssign.field && !configAssign.field.extension) throw new Error('>>field.extension<< not defined');
    this.configuration = configAssign;
    this.files_to_work = await this.selectFilesToWork(`${this.baseDir}/${this.configuration.entity_dir}`);

    if (this.files_to_work.length == 0) {
      throw new Error((0, _util.logError)('Need minimum a  model file selected to work.'));
    }

    this.transportFiles = transportFiles;
    this.render = render;
  }

  getFilesEntityFolder(path) {
    if ((0, _util2.nullOrUndefined)(path) || !(0, _util2.isString)(path) || path.length < 1) throw new Error('Path not defined to get entitys');
    let files = (0, _fsReaddirRecursive.default)(path);

    let splitFolderName = file => {
      let _file$split = file.split('/'),
          _file$split2 = _slicedToArray(_file$split, 2),
          folder = _file$split2[0],
          fileName = _file$split2[1];

      return {
        folder,
        fileName
      };
    };

    let getFileName = file => splitFolderName(file).fileName;

    let getByFileName = folderName => file => splitFolderName(file).folder === folderName;

    let getFolderName = file => splitFolderName(file).folder;

    let getWithoutFolder = file => !splitFolderName(file).fileName;

    let keys = files.filter(getFileName).map(getFolderName);
    let choices = {
      "/": files.filter(getWithoutFolder)
    };
    keys.forEach(key => {
      let filesFromKey = files.filter(getByFileName(key));
      choices[key] = filesFromKey;
    });
    return choices;
  }

  async selectFilesToWork(path) {
    let choices = this.getFilesEntityFolder(path);
    let promptFiles = new _promptCheckbox.default({
      name: 'files',
      radio: true,
      message: 'Choise the files to resolve:',
      choices
    });
    let result = await promptFiles.run();
    return result || [];
  }

  async initTransport({
    transport = {}
  }) {
    this.transport = transport;
    if (!this.files.length) this.files = [...this.files_to_work];
    this.fileInUse = this.files.shift();
    console.log(_chalk.default.green(`Plugin:${this.name} process file ${this.fileInUse}`));

    let entityContentFile = require(`${this.baseDir}${this.configuration.entity_dir}/${this.fileInUse}`, 'utf-8');

    this.entity = new _entityManager.default(this.configuration, this.baseDir, this.render);
    this.entity.import(entityContentFile);
  }

  async beforeRender({
    argsToParseViewRender = {}
  } = {}) {
    argsToParseViewRender[`${this.name}:name`] = this.entity.name;
    argsToParseViewRender[`${this.name}:forms`] = this.entity.getRenderedAttributes();
    argsToParseViewRender[`${this.name}:files`] = this.files_to_work;
    argsToParseViewRender[`${this.name}:entitys_config`] = await this.getEntitysConfig();
    argsToParseViewRender[`${this.name}:references`] = this.entity.getReferences();
    argsToParseViewRender[`${this.name}:attributes`] = this.entity.attributes;
    argsToParseViewRender[`${this.name}:custom`] = this.entity.custom;
    return argsToParseViewRender;
  }

  async getEntitysConfig() {
    let getContentFile = filePath => require(`${this.baseDir}${this.configuration.entity_dir}/${filePath}`);

    let result = this.files_to_work.map(getContentFile);
    return result;
  }

  async doneRender(loop = false) {
    let hasFiles = this.files.length;
    loop = hasFiles && this.transport.options.loop !== false;
    return {
      loop
    };
  }

}

var _default = Entity;
exports.default = _default;