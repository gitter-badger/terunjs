"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _symfony = require("../plugins/symfony");

class Plugin {
  constructor() {
    this.plugins = [(0, _symfony.SymfonyEntityForm)()];
  }

}

exports.default = Plugin;