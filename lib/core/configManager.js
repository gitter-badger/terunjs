"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConfigManager {
  constructor(base_path) {
    this.config_folder = 'config';
    this.config_path = `${process.cwd()}/${this.config_folder}`;
  }

  getMainConfig(env = 'default') {
    try {
      return require(`${process.env.WORK_PATH || process.cwd()}/terun.${env}.json`);
      ;
    } catch (e) {
      throw new Error(_chalk.default.red(`Config > terun.${env}.json < not found or empty`));
    }
  }

  getMainConfigWithPath(path, env) {
    try {
      return require(`${path}/terun.${env}.json`);
    } catch (e) {
      throw new Error(e);
    }
  }

  getPipelineFunctionsFile() {
    try {
      return require(`${this.config_path}/pipes.js`);
    } catch (e) {
      return null;
    }
  }

  getConfigAttributes() {
    try {
      return require(`${this.config_path}/attributes.js`, 'utf-8');
    } catch (e) {
      return {};
    }
  }

}

var _default = new ConfigManager();

exports.default = _default;