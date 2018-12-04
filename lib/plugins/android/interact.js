"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prompt = _interopRequireDefault(require("prompt"));

var _promptCheckbox = _interopRequireDefault(require("prompt-checkbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AndroidInteract {
  static async getColumnsFilterBySelection(columns, exclude) {
    let options = new _promptCheckbox.default({
      name: 'columns',
      message: 'Select columns to use:',
      radio: true,
      choices: columns.map(c => c.name)
    });
    return new Promise(async (resolve, reject) => {
      if (!exclude) {
        resolve(columns);
      }

      let finalOptions = await options.run();
      let finalColumns = columns.filter(column => {
        return finalOptions.find(c => c === column.name);
      });
      resolve(finalColumns);
    });
  }

  static async getTableNameFromUser() {
    return new Promise((resolve, reject) => {
      _prompt.default.start();

      _prompt.default.get(['Name table from DB?'], async (err, result) => {
        resolve(result["Name table from DB?"]);
      });
    });
  }

  static async getOptionsFromUser() {
    let options = new _promptCheckbox.default({
      name: 'options',
      message: 'Options:',
      choices: ['Recursive', 'Guess', 'Exclude']
    });
    return new Promise(async (resolve, reject) => {
      let finalOptions = await options.run();
      resolve({
        recursive: finalOptions.includes('Recursive'),
        exclude: finalOptions.includes('Exclude'),
        guess: finalOptions.includes('Guess')
      });
    });
  }

}

var _default = AndroidInteract;
exports.default = _default;