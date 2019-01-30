import chalk from 'chalk';
import plural from 'pluralize-ptbr';
import fs from 'fs';

exports.validParameter = (object, args) => {
	return args.filter((arg) => {
		let has = object.hasOwnProperty(arg);
		return !has;
	});
};

exports.logError = (message) => {
	return console.log(chalk.red(message));
};

exports.dropFileName = (to) => {
	let splitted = to.split('/');

	if (!splitted) return '';

	let withoutFilenameArray = splitted.slice(0, splitted.length - 1) || '';

	if (!withoutFilenameArray) return '';

	return withoutFilenameArray.join('/');
};

exports.capitalize = (text) => {
	return text.replace(/^\w/, c => c.toUpperCase());
};


exports.pluralName = (text) => {
	return plural(text);
};

exports.getFile = async (from) => {
	let baseDir = `${process.cwd()}/${from}`;
	let content = await fs.readFileSync(baseDir, 'utf-8');
	return content;
};

exports.flatArray = (array,depth = 1) =>{
	return array.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth-1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
}
