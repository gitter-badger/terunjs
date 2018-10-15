import { SymfonyEntityForm } from '../plugins/symfony';


export default class Plugin {
    constructor() {
        this.plugins = [new SymfonyEntityForm()];
    }

    _runPlugins(plugins, method, ...args) {
        plugins.forEach((plugin) => {
            let pluginInstance = this.plugins.find((pluginUnique) => plugin.name === pluginUnique.name)
            pluginInstance[method].apply(pluginInstance, args);
        })
    }

    init() {
        this._runPlugins('init');
    }

    beforeRender(plugins, args) {
        this._runPlugins(plugins, 'beforeRender', args)
    }

    config(plugins, args){
        this._runPlugins(plugins, 'config', args)
    }
}