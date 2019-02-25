import chalk from 'chalk';
import plural from 'pluralize-ptbr';
import fs from 'fs';
import fx from 'mkdir-recursive';
import funclize from './funclize';

export const fn = {
	filter: funclize(Array.prototype.filter),
	map: funclize(Array.prototype.map),
	join: (value, delimiter='') => funclize(Array.prototype.join)(value, delimiter)
}

export function getMissingProperties(object, args){
	if(nullOrUndefined(object) || nullOrUndefined(args)) return [];

	let hasPropertie = value => !object.hasOwnProperty(value);

	return args |> fn.filter(_, hasPropertie)
};

export function underscore(value){
	if(nullOrUndefined(value)) return '';

	value = value |> clearWhitespace |> firstLower;

	let put_underscore = (letter)=> letter.match(/[A-Z]/g) ? `_${letter |> lowerCase}` : letter;

	return value |> split |> fn.map(_, put_underscore) |> fn.join
}

export function split(value, delimiter = ''){
	if(nullOrUndefined(value)) return [];
	return value.split(delimiter)
}

export function clearWhitespace(value){
	if(nullOrUndefined(value)) return '';
	return value.replace(/\s+/g,'');
}

export async function createDir(to) {
	let dirToCreate = `${removeFileNameInPath(to)}`;
	return await fx.mkdirSync(dirToCreate);
}

export function logError(message){
	if(nullOrUndefined(message)) return '';

	return console.log(chalk.red(message));
}

export function isFileString(value){
	if(nullOrUndefined(value)) return '';

	return value |> trim |> hasMatch(_, /\w+\.\w+/);
}

export function hasMatch(value, regex){
	if(nullOrUndefined(value)) return '';
	if(nullOrUndefined(regex)) return '';

	return value.match(regex)
}

export function trim(value){
	if(nullOrUndefined(value)) return '';

	return value.trim()
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

	let withoutFilenameArray = splittedPath |> fn.filter(_,isFolder)

	if (!withoutFilenameArray) return '';

	return withoutFilenameArray |> fn.join(_, '/');
}

export function replace(value, search, replace){
	if(nullOrUndefined(value)) return '';
	if(nullOrUndefined(search)) return '';
	if(nullOrUndefined(replace)) return '';

	return value.replace(search, replace)
}

export function capitalize(text){
	if(nullOrUndefined(text)) return '';

	return text |> replace(_, /^\w/, upperCase)
}

export function firstLower(text){
	if(nullOrUndefined(text)) return '';

	let [head,...tail]= text;

	if(!head) return '';

	head = head |> lowerCase
	tail = tail |> fn.join

	return head + tail;
}

export function lowerCase(text){
	if(nullOrUndefined(text)) return '';
	return text.toLowerCase();
}

export function upperCase(text){
	if(nullOrUndefined(text)) return '';
	return text.toUpperCase();
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


export function validObjectThrow(config, args) {
	let errorsBaseConfig = getMissingProperties(config, args);
	let hasError = errorsBaseConfig && errorsBaseConfig.length > 0;

	if (hasError)
		errorsBaseConfig.forEach(error => {throw new Error(`Not found parameter ${error}`)});

	return !hasError;
}

export function log (message){
	return (value)=>{
		console.log(`${message} => ${value}`);
        return value;
	}
}