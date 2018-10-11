import fs from 'fs';

export class SymfonyEntityForm {
    constructor() {
        this.config = {}
    }

    setConfig(config) {
        let configAssign = Object.assign({}, config);
        this.config = {
            from: configAssign.from,
            name: configAssign.name
        }
    }

    async _getProperties() {
        let base_dir = `${process.cwd()}/${this.config.from}`;
        let content = await fs.readFileSync(base_dir, 'utf-8')

        let properties = content.match(/((private|public|protected)\s\$\w+;)/g);
        let clearProperties = properties.map((propertie) => {
            let cleared = propertie.replace(/(public|private|protected)\s|;|\$/g, '')
            return cleared;
        })

        return clearProperties;
    }

    async getForm() {
        let properties = await this._getProperties();
        let renderForm = (properties) => {
            return properties.reduce((ant, act) => {
                if (!ant) return ant + `add('${act}')`;

                return ant + `->add('${act}')\n`
            }, '')
        }
        let renderedForm = `$builder->${renderForm(properties)};`
        return renderedForm;
    }
}