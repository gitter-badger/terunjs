"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.regexp.match");

var _configManager = _interopRequireDefault(require("../core/configManager"));

var _util = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let custom_functions = _configManager.default.getPipeFunctions();

let default_functions = {
  upper: function upper(value) {
    return value.toUpperCase();
  },
  lower: function lower(value) {
    return value.toLowerCase();
  },
  underscore: function underscore(value) {
    value = (0, _util.firstLower)(value);

    let put_underscore = letter => {
      if (letter.match(/[A-Z]/g)) {
        return `_${letter.toLowerCase()}`;
      } else {
        return letter;
      }
    };

    return value.split('').map(put_underscore).join('');
  },
  firstlower: function firstlower(value) {
    return (0, _util.firstLower)(value);
  },
  capitalize: function capitalize(value) {
    return (0, _util.capitalize)(value);
  }
};

if (custom_functions) {
  default_functions = Object.assign(default_functions, custom_functions);
}

var _default = default_functions;
exports.default = _default;