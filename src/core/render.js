import Mustache from './mustache';
import fs from 'fs';

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
		let content = fs.readFileSync(from_file, 'utf8');
		if (!content) throw new Error('File not found or file empty');
		return this.template.render(content, argsToRender, {}, this.customTags);
	}

	renderSimple(content, argsToRender = {}, customTags) {
		return this.template.render(content, argsToRender, {}, customTags || this.customTags);
	}
}

export default Render;