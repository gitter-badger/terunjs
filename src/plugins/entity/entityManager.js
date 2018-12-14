import Attribute from './attribute';

class EntityManager{
    constructor(config, baseDir, render, options ={}){
        this.configuration = config;
        this.name  = '';
        this.attributes = [];
        this.baseDir = baseDir;
        this.render = render;
        this.isReference = (options.reference) ? true : false;
    }

    fromJson(json){
        json = JSON.parse(json);
        let entity = json.entity;
        this.name = entity.name;
        
        if(this.isReference) return;

        this.attributes = Object.keys(entity.attributes).map(attributeKey => {
            let attribute = new Attribute(this.configuration, this.baseDir, this.render)
            attribute.fromJson(entity.attributes[attributeKey], attributeKey);
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