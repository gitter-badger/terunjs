import Attribute from './attribute';

class EntityManager{
    constructor(config, baseDir, render){
        this.configuration = config;
        this.name  = '';
        this.attributes = [];
        this.baseDir = baseDir;
        this.render = render;
    }

    fromJson(json){
        json = JSON.parse(json);
        let entity = json.entity;
        this.name = entity.name;

        this.attributes = Object.keys(entity.attributes).map(attributeKey => {
            let attribute = new Attribute(this.configuration, this.baseDir, this.render)
            entity.attributes[attributeKey].name = attributeKey;
            attribute.fromJson(entity.attributes[attributeKey]);
            return attribute;
        })
    }

    getRenderedAttributes(){
        return this.attributes
        .filter(attribute=> !attribute.isReference)
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