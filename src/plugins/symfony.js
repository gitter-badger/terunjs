import fs from 'fs';
import { capitalize, pluralName } from '../utils/util';


export class SymfonyEntityForm{
    constructor() {
        this.name = "symfony:entity-form"
        this.config = {}
    }

    setConfig(config) {
        let configAssign = Object.assign({}, config);

        if (!configAssign.from) throw new Error(`>>From<< not defined`);

        this.config = {
            from: configAssign.from,
            name: configAssign.name
        }
    }

    async inRender(objectToSetArgs = {}) {
        // set helpers
        objectToSetArgs['s:class_lower'] = (await this.getClassName()).toLowerCase();
        objectToSetArgs['s:class_upper'] = capitalize((await this.getClassName()));
        objectToSetArgs['s:class_plural_lower'] = pluralName((await this.getClassName())).toLowerCase();
        objectToSetArgs['s:class_plural_upper'] = capitalize(pluralName((await this.getClassName())));

        // set parameters
        objectToSetArgs['symfony-form-builder'] = await this.getForm();
        objectToSetArgs['symfony-entity-props'] = await this.getEntityPropertiesToView();
        objectToSetArgs['symfony-entity-get-entity-print-codes'] = await this.getEntityPrintCodes(objectToSetArgs['s:class_lower'] || '');
        objectToSetArgs['symfony-entity-props-counter'] = (await this.getPropertiesCounter() + 1);

        return objectToSetArgs;
    }

    async _getFile() {
        let base_dir = `${process.cwd()}/${this.config.from}`;
        let content = await fs.readFileSync(base_dir, 'utf-8')
        return content;
    }

    async getProperties() {
        let content = await this._getFile();
        let properties = content.match(/((private|public|protected)\s\$\w+;)/g);
        let clearProperties = properties.map((propertie) => {
            let cleared = propertie.replace(/(public|private|protected)\s|;|\$/g, '')
            return cleared;
        })

        return clearProperties;
    }

    async getClassName() {
        let content = await this._getFile();
        let classNameMatchs = content.match(/(class\s[a-zA-z]+)/g);
        if (classNameMatchs && classNameMatchs.length == 0) return '';

        let className = classNameMatchs[0].replace(/(class|\s)/g, '');
        return className
    }

    async getPropertiesCounter() {
        let propriedades = await this.getProperties();
        let counter = propriedades ? propriedades.length : 0;
        return counter;
    }

    async getEntityPropertiesToView() {
        let properties = await this.getProperties();
        properties = properties.map((propertie) => `${capitalize(propertie)}`);
        return properties;
    }

    async getForm() {
        let properties = await this.getProperties();
        let renderForm = (properties) => {
            return properties.reduce((ant, act) => {
                if (!ant) return ant + `add('${act}')`;

                return ant + `->add('${act}')`
            }, '')
        }
        let renderedForm = `$builder->${renderForm(properties)};`
        return renderedForm;
    }

    async getEntityPrintCodes(name_entity) {
        let properties = await this.getProperties();
        properties = properties.map((propertie) => `${name_entity}.${propertie}`);
        return properties;
    }
}