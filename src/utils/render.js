import Mustache from 'mustache';
import fs from 'fs';

class Render {
    constructor(custom_tags = ['{{', '}}']) {
        this.template = Mustache;
        this.custom_tags = custom_tags;
    }

    // RENDER final file
    renderFile(from_file, args_to_render = {}) {
        let content = fs.readFileSync(from_file, 'utf8');
        if (!content) throw new Error('File not found or file empty')
        return this.template.render(content, args_to_render, {}, this.custom_tags);
    }

    renderSimple(content, args_to_render = {}, custom_tags) {
        return this.template.render(content, args_to_render, {}, custom_tags || this.custom_tags);
    }
}

export default Render;