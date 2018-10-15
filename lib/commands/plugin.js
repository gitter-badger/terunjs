"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _symfony = require("../plugins/symfony");

class Plugin {
  constructor() {
    this.plugins = [new _symfony.SymfonyEntityForm()];
  }

  _runPlugins(plugins, method, ...args) {
    plugins.forEach(plugin => {
      let pluginInstance = this.plugins.find(pluginUnique => plugin.name === pluginUnique.name);
      pluginInstance[method].apply(pluginInstance, args);
    });
  }

  init() {
    this._runPlugins('init');
  }

  beforeRender(plugins, args) {
    this._runPlugins(plugins, 'beforeRender', args);
  }

  config(plugins, args) {
    this._runPlugins(plugins, 'config', args);
  }

}

exports.default = Plugin;