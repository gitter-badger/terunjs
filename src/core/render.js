import Mustache from './mustache';
import fs from 'fs';
import pipelineFunctions from './pipeline_function';
import { nullOrUndefined } from '../utils/util';

class Render {
	constructor(customTags = ['{{', '}}']) {
		this.template = Mustache;
		this.customTags = customTags;
		this.template.escape = function(text){
			return text;
		};
	}

	// RENDER final file
	renderFile(from_file, argsToRender = {}) {
		if(nullOrUndefined(argsToRender)) return null;

		let content = fs.readFileSync(from_file, 'utf8');
		if (!content) throw new Error('File not found or file empty');
		argsToRender = argsToRender |> this._mergePipeline
		return this.template.render(content, argsToRender, {}, this.customTags);
	}

	renderSimple(content, argsToRender = {}, customTags) {
		if(nullOrUndefined(argsToRender)) return null;
		
		argsToRender = argsToRender |> this._mergePipeline
		return this.template.render(content, argsToRender, {}, customTags || this.customTags);
	}

	_mergePipeline(object){
		return Object.assign(object, pipelineFunctions)
	}
}

export default Render;