import { capitalize, pluralName } from '../../utils/util';
import { getFile } from '../../utils/util';
import { isAnnotation } from './helper';
import regexHelper from './regex';

class SymfonyEntity {
	constructor() {
		this.name = 'symfony:entity-form';
		this.configuration = {};
		this.content = '';
	}

	async config(config, globalArgs, render) {
		let configAssign = Object.assign({}, config);
		if (!configAssign.from) throw new Error('>>From<< not defined');

		this.configuration = {
			from: render.renderSimple(configAssign.from, globalArgs),
			name: configAssign.name
		};

		this.content = await getFile(`${process.cwd()}/${this.configuration.from}`);
	}

	async beforeRender(objectToSetArgs = {}) {
		// set helpers
		objectToSetArgs['s:class'] = await this.getClassName();
		objectToSetArgs['s:class_lower'] = (await this.getClassName()).toLowerCase();
		objectToSetArgs['s:class_cap'] = capitalize((await this.getClassName()));
		objectToSetArgs['s:class_plural_lower'] = pluralName((await this.getClassName())).toLowerCase();
		objectToSetArgs['s:class_plural_cap'] = capitalize(pluralName((await this.getClassName())));

		// set parameters
		objectToSetArgs['symfony-form-builder'] = await this.getForm();
		objectToSetArgs['symfony-entity-props'] = await this.getEntityPropertiesToView();
		objectToSetArgs['symfony-entity-get-entity-print-codes'] = await this.getEntityPrintCodes(objectToSetArgs['s:class_lower'] || '');
		objectToSetArgs['symfony-entity-props-counter'] = (await this.getPropertiesCounter() + 1);

		return objectToSetArgs;
	}

	async getProperties() {
		let properties = this.content.match(regexHelper.PROPERTIES);
		let clearProperties = properties.map((propertie) => {
			let cleared = propertie.replace(regexHelper.PROPERTIES_REPLACE, '');
			return cleared;
		});

		return clearProperties;
	}

	async getClassName() {
		let classNameMatchs = this.content.match(regexHelper.CLASS_NAME);

		if (!classNameMatchs) return '';

		if (classNameMatchs && classNameMatchs.length == 0) return '';

		let className = classNameMatchs[0].replace(regexHelper.CLASS_NAME_REPLACE, '');

		return className;
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

				return ant + `->add('${act}')`;
			}, '');
		};
		let renderedForm = `$builder->${renderForm(properties)};`;
		return renderedForm;
	}

	async _getPropertiesWithValidations() {
		/**
         * [
         *      {
         *          "propertie":"id",
         *          "validations":[
         *              '@ORMId()'
         *              '@ORMGeneratedValue()'
         *          ]
         *      }
         * ]
         */

		let regex = regexHelper.PROPERTIES_WITH_VALIDATIONS;
		let matchs = this.content.match(regex);

		if (!matchs) return [];

		let properties = [];
		let objectPropertie = {
			propertie: '',
			validations: []
		};

		matchs.forEach((match) => {
			if (isAnnotation(match)) {
				objectPropertie.validations = [...objectPropertie.validations, match];
				return;
			}

			objectPropertie.propertie = match.replace(regexHelper.PROPERTIES_REPLACE, '');
			properties = [...properties, objectPropertie];

			objectPropertie = {
				propertie: '',
				validations: []
			};
		});

		return properties;
	}

	async getEntityPrintCodes(name_entity) {
		let properties = await this.getProperties();
		properties = properties.map((propertie) => `${name_entity}.${propertie}`);
		return properties;
	}
}

export default SymfonyEntity;