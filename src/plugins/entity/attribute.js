import fs from 'fs';
import chalk from 'chalk';
import EntityManager from './entityManager';

class Attribute{
    constructor(configPlugin, baseDir, render, options = {}){
        this.configurationPlugin = configPlugin;
        this.baseDir             = baseDir;
        this.render              = render;
        this.configuration       = {};
        this.fileExtensionPath   = '';
        this.baseDirFields       = '';
        this.defaultValues       = {};
        this.options             = {};
        this.type                = '';
        this.isReference         = (options.reference) ? true : false;
        this.typeReference       = undefined;
        this.reference           = undefined;
        this.avaliableTypesReference = ['hasMany','belongsToMany','hasOne','belongsToOne']
    }

    loadConfig(){
        if(!this.configurationPlugin.field.config) return;

        this.configuration = JSON.parse(fs.readFileSync(`${this.baseDirFields}/${this.configurationPlugin.field.config}.json`,'utf-8'));

        this.setDefaultValues(this.configuration.defaultValues || {})
    }

    setDefaultValues(defaultValues){
        Object.keys(defaultValues).forEach(key=>{
            let attributeExists = Object.getOwnPropertyDescriptor(this.options,key);
            let valueKey        = defaultValues[key];
            if(!attributeExists){
                this.options[key] = valueKey;
            }
        })
    }

    fromJson(json, name){
        this.name = name;
        
        if(typeof json != "object") json = JSON.parse(json) 

        if(!json.type){
            console.log(chalk.red(`>>type<< not found in attribute`))
            throw new Error('Type not found in attribute')
        }

        this.type = json.type;
        this.options = json;

        if(this.options.reference){
            this.getReference(this.type, this.options.reference)
        }
        
        this.baseDirFields = `${this.baseDir}${this.configurationPlugin.field.dir}`;
        this.fileExtensionPath     = `${this.baseDirFields}/${this.type}.${this.configurationPlugin.field.extension}`;

        if(!this.resolveTypeFile()){
            console.log(chalk.red(`File ${this.type}.${this.configurationPlugin.field.extension || ''} type attribute not found.`))
            throw new Error('File not found')
        }

        this.loadConfig();
    }

    getReference(type, options){
        if(this.isReference) return;

        if(!options.entity){
            console.log(chalk.red(`>>entity<< not found in reference`))
            throw new Error('Entity not found in reference')
        }

        if(!this.avaliableTypesReference.includes(type)){
            console.log(chalk.red(`>>type<< not found in avaliables types`))
            throw new Error('Type not found in avaliables types')
        }

        let referenceEntity = fs.readFileSync(`${this.baseDir}${this.configurationPlugin.entity_dir}/${options.entity}.json`,'utf-8')
        this.reference = new EntityManager(this.configurationPlugin, this.baseDir, this.render, { reference:true })
        this.reference.fromJson(referenceEntity)
        this.isReference = true;
        this.typeReference = type;
    }

    resolveTypeFile(){
        return fs.existsSync(this.fileExtensionPath);
    }

    getRenderedAttribute(reference){
        return this.render.renderFile(this.fileExtensionPath, {
            name:this.name,
            ...this.options,
            reference
        });
    }
}

export default Attribute;