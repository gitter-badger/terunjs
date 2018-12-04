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

exports.camelize = (text, separator) => {
	return text
	  .replace(/_/g, " ")  
	  .split(" ")
	  .map(value => {
		  let lowerCase = value.toLowerCase() 
		  return lowerCase.slice(0,1).toUpperCase() + lowerCase.slice(1)
	  })
	  .join("")
}

exports.camelizeLessFirst = (text, separator) => {
	text = text
	  .replace(/_/g, " ")  
	  .split(" ")
	  .map(value => {
		  let lowerCase = value.toLowerCase() 
		  return lowerCase.slice(0,1).toUpperCase() + lowerCase.slice(1)
	  })
	  .join("")
	
	return text.slice(0,1).toLowerCase() + text.slice(1);
}

exports.pluralName = (text) => {
	return plural(text);
};

exports.getFile = async (from) => {
	let baseDir = `${process.cwd()}/${from}`;
	let content = await fs.readFileSync(baseDir, 'utf-8');
	return content;
};