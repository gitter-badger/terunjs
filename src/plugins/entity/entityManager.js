import Attribute from './attribute';
import { fn } from '../../utils/util';
import ConfigManager from '../../core/configManager';

class EntityManager{
    constructor(config, baseDir, render, options ={}){
        this.configuration = config;
        this.configurationAttributes = {};
        this.name  = '';
        this.attributes = [];
        this.baseDir = baseDir;
        this.render = render;
        this.custom = {};
        this.isReference = (options.reference) ? true : false;

        this.loadConfig();
    }

    loadConfig(){
        this.configurationAttributes = ConfigManager.getConfigAttributes();

        if(!this.configurationAttributes)
            return;

        if(!this.configurationAttributes.defaultValues)
            return;

        if(this.configurationAttributes.defaultValues.custom)
            this.setDefaultCustomValues(this.configurationAttributes.defaultValues.custom);
    }

    setDefaultCustomValues(defaultValues){
        let getKeys = (values) => Object.keys(values);
        let hasPropertieInObject = (object) => (propertie) => Object.getOwnPropertyDescriptor(object, propertie)
        let setKeyInObject = ({ from, to }) => (key) => {
            to[key] = from[key] 
            return from[key]
        }

        defaultValues 
            |> getKeys 
            |> fn.filter(_, (propertie) => !!hasPropertieInObject(this.custom, propertie))
            |> fn.map(_,setKeyInObject({ from: defaultValues, to: this.custom}))
    }

    import(contentFile){
        let schema = contentFile.schema;
        this.name   = schema.name;
        this.custom = schema.custom ? schema.custom : {}

        if(this.isReference) return;

        this.attributes = Object.keys(schema.attributes).map(attributeKey => {
            let attribute = new Attribute(this.configuration, this.baseDir, this.render)
            attribute.import(schema.attributes[attributeKey], attributeKey);
            attribute.setConfig(this.configurationAttributes || {});
            return attribute;
        })
    }

    getRenderedAttributes(){
        return this.attributes
        .map(attribute =>{
            return attribute.getRenderedAttribute(this)
        })
    }

    getReferences(){
        return this.attributes
        .filter(attribute=>{
            return attribute.isReference
        })
    }
}

export default EntityManager;
