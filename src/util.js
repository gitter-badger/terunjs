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