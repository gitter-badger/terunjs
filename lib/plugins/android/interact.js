"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.constructor");

var _promptCheckbox = _interopRequireDefault(require("prompt-checkbox"));

var _promptAutocompletion = _interopRequireDefault(require("prompt-autocompletion"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AndroidInteract {
  static async getColumnsFilterBySelection(columns, exclude) {
    return new Promise(async (resolve, reject) => {
      if (!exclude) {
        return resolve(columns);
      }

      let options = new _promptCheckbox.default({
        name: 'columns',
        message: 'Select columns to use:',
        radio: true,
        choices: columns.map(c => c.name)
      });
      let finalOptions = await options.run();
      let finalColumns = columns.filter(column => {
        return finalOptions.find(c => c === column.name);
      });
      resolve(finalColumns);
    });
  }

  static async getTableNameFromUser(tables) {
    return new Promise(async (resolve, reject) => {
      const filterSearchTableName = input => {
        return function (state) {
          return new RegExp(input, 'i').exec(state) !== null;
        };
      };

      const search = function search(answers, input) {
        return new Promise(function (resolveSearch) {
          resolveSearch(tables.filter(filterSearchTableName(input)));
        });
      };

      let autocomplete = new _promptAutocompletion.default({
        type: 'autocomplete',
        name: 'tablename',
        message: 'Select table from database: ',
        source: search
      });
      let finalAutocomplete = await autocomplete.run();
      return resolve(finalAutocomplete);
    });
  }

  static async getOptionsFromUser() {
    return new Promise(async (resolve, reject) => {
      let options = new _promptCheckbox.default({
        name: 'options',
        message: 'Options:',
        choices: ['Exclude', 'Ignore Foreign Keys']
      });
      let finalOptions = await options.run();
      resolve({
        exclude: finalOptions.includes('Exclude'),
        ignoreForeignKeys: finalOptions.includes('Ignore Foreign Keys')
      });
    });
  }

}

var _default = AndroidInteract;
exports.default = _default;