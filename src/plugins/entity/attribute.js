import fs from 'fs';
import chalk from 'chalk';

class Attribute{
    constructor(config, baseDir, render){
        this.configuration = config;
        this.baseDir     = baseDir;
        this.render = render;
    }

    fromJson(json){
        this.name        = json.name
        this.maxlength   = json.maxlength || 50;
        this.required    = json.required ? true : false;
        this.placeholder = json.placeholder || '';
        this.type        = json.type || 'text';
        this.label       = json.label || '';
        this.fileDir     = `${this.baseDir}${this.configuration.field_dir}/${this.type}.${this.configuration.field_extension}`;


        if(!this.resolveTypeFile(this.type)){
            console.log(chalk.red(`File ${this.type}.${this.configuration.field_extension || ''} type attribute not found.`))
            throw new Error('File not found')
        }
    }

    resolveTypeFile(type){
        return fs.existsSync(this.fileDir);
    }

    getRenderedAttribute(entity){
        return this.render.renderFile(this.fileDir, {
            ...this,
            entity
        });
    }
}

export default Attribute;