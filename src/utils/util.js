import chalk from 'chalk';
import plural from 'pluralize-ptbr';
import fs from 'fs';

export function getMissingProperties(object, args){
	if(nullOrUndefined(object) || nullOrUndefined(args)) return [];
	return args.filter((arg) => {
		let has = object.hasOwnProperty(arg);
		return !has;
	});
};


export function logError(message){
	if(nullOrUndefined(message)) return '';

	return console.log(chalk.red(message));
}

export function isFileString(value){
	return value.trim().match(/\w+\.\w+/);
}

export function isString(value){
	if(nullOrUndefined(value)) return false;

	return typeof value === 'string'; 
}

export function removeFileNameInPath(path){
	if(nullOrUndefined(path)) return '';

	let splittedPath = [];
	if(isString(path)){
		splittedPath = path.split('/');
		if (!splittedPath) return '';
	}else{
		splittedPath = path;
	}

	let isFolder = value => !isFileString(value)
  
	let withoutFilenameArray = splittedPath.filter(isFolder)

	if (!withoutFilenameArray) return '';

	return withoutFilenameArray.join('/');
}

export function capitalize(text){
	if(nullOrUndefined(text)) return '';

	return text.replace(/^\w/, c => c.toUpperCase());
}

export function firstLower(text){
	if(nullOrUndefined(text)) return '';
	
	let [head,...tail]= text;

	if(!head) return '';

	head = head.toLowerCase();
	tail = tail.join('');

	return head + tail;
}

export function pluralName(text){
	if(nullOrUndefined(text)) return '';
	
	return plural(text);
}

export async function getFile(path){
	if(nullOrUndefined(path)) return null;
	
	try{
		let content = fs.readFileSync(path, 'utf-8');
		return content;
	}catch(e){
		return null;
	}
}

export function nullOrUndefined(value){
	return (value == null) || (value == undefined) 
}

export function flatArray(array,depth = 1){
	if(nullOrUndefined(array)) return [];

	if(!Array.isArray(array)) return [];

	return array.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth-1)) ? flatArray(toFlatten, depth-1) : toFlatten);
	  }, []);
}

