"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("../utils/util");

class Functions {
  constructor() {
    this.functions = {
      "plural": _util.pluralName,
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
      "capitalize": _util.capitalize
    };
  }

}

exports.default = Functions;