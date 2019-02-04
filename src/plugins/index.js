import SymfonyEntity from './symfony/symfony';
import Entity from './entity/entity';

export default class Plugin {
	constructor(render) {
		this.plugins = [
			new SymfonyEntity(),
			new Entity()
		];
		this.pluginsInUse = [];
		this.render = render;
	}

	init(plugins) {
		if (!plugins) return;
		this.pluginsInUse = [...plugins];
	}

	async config(globalProperties, baseConfig, transportFiles) {
		if (!this.pluginsInUse) return null;

		for(let config of this.pluginsInUse){
			let pluginInstance = this.plugins.find((pluginUnique) => config.name === pluginUnique.name);
			await pluginInstance['config'].call(pluginInstance, config, globalProperties, this.render, baseConfig, transportFiles);
		}
	}

	async initTransport(){
		if (!this.pluginsInUse) return argsToParseViewRender;
		let args = Object.assign({});

		for(let config of this.pluginsInUse){
			let pluginInstance = this.plugins.find((pluginUnique) => config.name === pluginUnique.name);
			args = await pluginInstance['initTransport'].call(pluginInstance);
		}
		return args;
	}

	async beforeRender(argsToParseViewRender) {
		if (!this.pluginsInUse) return argsToParseViewRender;
		let args = Object.assign(argsToParseViewRender);

		for(let config of this.pluginsInUse){
			let pluginInstance = this.plugins.find((pluginUnique) => config.name === pluginUnique.name);
			args = await pluginInstance['beforeRender'].call(pluginInstance, argsToParseViewRender, this.render);
		}
		return args;
	}

	async doneRender() {
		let loop = false;

		if (!this.pluginsInUse) return {
			loop
		};

		let args = Object.assign({});

		for(let config of this.pluginsInUse){
			let pluginInstance = this.plugins.find((pluginUnique) => config.name === pluginUnique.name);
			args = await pluginInstance['doneRender'].call(pluginInstance) || {};

			loop = (args && args.loop) ? true : false

			args.loop = loop;
		}

		return args;
	}
}