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
        return this.attributes.map(attribute =>{
            return attribute.getRenderedAttribute(this)
        })
    }
}

export default EntityManager;