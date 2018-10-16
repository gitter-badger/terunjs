"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _symfony = _interopRequireDefault(require("./symfony/symfony"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Plugin {
  constructor(render) {
    this.plugins = [new _symfony.default()];
    this.pluginsInUse = [];
    this.render = render;
  }

  init(plugins) {
    if (!plugins) return;
    this.pluginsInUse = [...plugins];
  }

  async beforeRender(argsToParseViewRender) {
    if (!this.pluginsInUse) return argsToParseViewRender;
    let args = Object.assign(argsToParseViewRender);

    for (let config of this.pluginsInUse) {
      let pluginInstance = this.plugins.find(pluginUnique => config.name === pluginUnique.name);
      args = await pluginInstance['beforeRender'].call(pluginInstance, argsToParseViewRender, this.render);
    }

    return args;
  }

  config(argsToFileNameRender) {
    if (!this.pluginsInUse) return null;
    this.pluginsInUse.forEach(async config => {
      let pluginInstance = this.plugins.find(pluginUnique => config.name === pluginUnique.name);
      await pluginInstance['config'].call(pluginInstance, config, argsToFileNameRender, this.render);
    });
  }

}

exports.default = Plugin;