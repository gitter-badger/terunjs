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

  getMainConfig(env) {
    try {
      return require(`${process.cwd()}/terun.${env}.json`);
    } catch (e) {
      console.log(_chalk.default.red(`Config > terun.${env}.json < not found`));
      return null;
    }
  }

  getPipeFunctions() {
    try {
      return require(`${this.config_path}/pipes.js`);
    } catch (e) {
      console.log(_chalk.default.red('Error in get config pipes.js'));
      return null;
    }
  }

  getConfigFields() {
    try {
      let file = fs.readFileSync(`${this.config_path}/fields.json`, 'utf-8');
      return JSON.parse(file);
    } catch (e) {
      return {};
    }
  }

}

var _default = new ConfigManager();

exports.default = _default;