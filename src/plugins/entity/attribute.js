import fs from 'fs';
import chalk from 'chalk';
import EntityManager from './entityManager';

class Attribute{
    constructor(configPlugin, baseDir, render, options = {}){
        this.configurationPlugin = configPlugin;
        this.baseDir             = baseDir;
        this.render              = render;
        this.configuration       = {};
        this.fileTypePath        = '';
        this.baseDirFields       = '';
        this.options             = {};
        this.type                = '';
        this.isReference         = (options && options.reference) ? true : false;
        this.typeReference       = undefined;
        this.reference           = undefined;
        this.avaliableTypesReference = ['hasMany','belongsToMany','hasOne','belongsToOne']
    }

    setConfig(configContent){
        this.configuration = configContent;
        this.setDictionary(this.configuration.dictionary || {})
        
        if(this.configuration.defaultValues)
            this.setDefaultValues(this.configuration.defaultValues.attribute || {})
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

    setDictionary(dictionary){
        let getLanguage = (key) => ({
            language: key,
            keys: dictionary[key]
        })

        let getValueFromType = (type) => ({ language, keys }) => ({
            language: language,
            value: keys[type]
        });

        let setValuesInInstance = ({language, value }) => {
            this[`type:${language}`] = value
        }

        Object
            .keys(dictionary)
            .map(getLanguage)
            .map(getValueFromType(this.type))
            .forEach(setValuesInInstance)
    }

    import(contentFile, name){
        this.name = name;

        if(!contentFile.type){
            console.log(chalk.red(`TYPE not found in attribute`))
            throw new Error('Type not found in attribute')
        }

        if(!contentFile.field && this.configuration.field){
            console.log(chalk.yellow(`FIELD not found in attribute (${this.name}). TYPE will be define to working in THIS field`))
        }

        this.type    = contentFile.type;
        this.field   = contentFile.field;
        this.options = contentFile;

        if(this.options.reference){
            this.getReference(this.options.reference)
        }else{
            this.field = this.type;
        }

        if(this.configurationPlugin && this.configurationPlugin.field){
            this.baseDirFields = `${this.baseDir}${this.configurationPlugin.field.dir}`;
            this.fileTypePath     = `${this.baseDirFields}/${this.field}.${this.configurationPlugin.field.extension}`;
        }

        if(this.configurationPlugin && this.configurationPlugin.field){
            if(!this.resolveTypeFile()){
                console.log(chalk.red(`File ${this.field}.${this.configurationPlugin.field.extension || ''} field attribute not found.`))
                throw new Error('File not found')
            }
        }
    }

    getReference(options){
        if(this.isReference) return;

        if(typeof options == 'string'){
            let [entity, relationship] = options.split('|')

            options              = {}
            options.entity       = entity.trim()
            options.relationship = relationship.trim()
        }


        if(!options.entity){
            console.log(chalk.red(`ENTITY not found in reference`))
            throw new Error('Entity not found in reference')
        }

        if(!options.relationship){
            console.log(chalk.red(`RELATIONSHIP not found in reference`))
            throw new Error('Relationship not found in reference')
        }

        if(!this.avaliableTypesReference.includes(options.relationship)){
            console.log(chalk.red(`RELATIONSHIP not found in avaliables types`))
            throw new Error('Type not found in avaliables types')
        }

        this.field = (this.field) ? this.field : options.relationship

        let referenceEntity = require(`${this.baseDir}${this.configurationPlugin.entity_dir}/${options.entity}.js`)
        this.reference = new EntityManager(this.configurationPlugin, this.baseDir, this.render, { reference:true })
        this.reference.import(referenceEntity)
        this.isReference = true;
        this.typeReference = options.relationship;

        return this.reference;
    }

    resolveTypeFile(){
        return fs.existsSync(this.fileTypePath);
    }

    getRenderedAttribute(reference){
        if(!this.configurationPlugin.field) return '';

        return this.render.renderFile(this.fileTypePath, {
            name:this.name,
            ...this.options,
            reference
        });
    }
}

export default Attribute;
