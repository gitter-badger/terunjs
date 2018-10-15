import chalk from 'chalk';

exports.validParameter = (object, args) => {
    return args.filter((arg) => {
        let has = object.hasOwnProperty(arg);
        return !has;
    });
}

exports.logError = (message) => {
    return console.log(chalk.red(message));
}

exports.dropFileName = (to) => {
    let splitted = to.split('/')

    if(!splitted) return "";

    let withoutFilenameArray = splitted.slice(0, splitted.length - 1) || "";

    if(!withoutFilenameArray) return "";

    return withoutFilenameArray.join('/')
}
