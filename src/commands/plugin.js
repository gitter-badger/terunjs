import { SymfonyEntityForm } from '../plugins/symfony/symfony';


export default class Plugin {
    constructor(render) {
        this.plugins = [
            new SymfonyEntityForm()
        ];
        this.pluginsInUse = [];
        this.render = render;
    }

    _runPlugins(plugins, method, args) {
        plugins.forEach((plugin) => {
            let pluginInstance = this.plugins.find((pluginUnique) => plugin.name === pluginUnique.name)

            let content = {
                config: plugin,
                args,
                render: Object.assign({}, this.render)
            }

            pluginInstance[method].call(pluginInstance, content);
        })
    }

    init(plugins) {
        if (!plugins) return;
        this.pluginsInUse = [...plugins];
    }

    async beforeRender(argsToParseViewRender) {
        if (!this.pluginsInUse) return argsToParseViewRender;

        let args = Object.assign(argsToParseViewRender);

        for(let config of this.pluginsInUse){
            let pluginInstance = this.plugins.find((pluginUnique) => config.name === pluginUnique.name)
            args = await pluginInstance['beforeRender'].call(pluginInstance, argsToParseViewRender, this.render);
        }

        return args;
    }

    config(argsToFileNameRender) {
        if (!this.pluginsInUse) return null;

        this.pluginsInUse.forEach((config) => {
            let pluginInstance = this.plugins.find((pluginUnique) => config.name === pluginUnique.name)
            pluginInstance['config'].call(pluginInstance, config, argsToFileNameRender, this.render);
        })
    }
}