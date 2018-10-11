"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.replace");

var _pluralizePtbr = _interopRequireDefault(require("pluralize-ptbr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Functions {
  constructor() {
    this.functions = {
      "plural": function plural() {
        return function (text, render) {
          return render((0, _pluralizePtbr.default)(text));
        };
      },
      "upper": function upper() {
        return function (text, render) {
          return render(text.toUpperCase());
        };
      },
      "lower": function lower() {
        return function (text, render) {
          return render(text.toLoweCase());
        };
      },
      "capitalize": function capitalize() {
        return function (text, render) {
          return render(text.replace(/^\w/, c => c.toUpperCase()));
        };
      }
    };
  }

}

exports.default = Functions;