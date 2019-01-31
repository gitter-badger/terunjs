import Mustache from 'mustache';
import pipeFuncions from './pipe_function.js'
import chalk from 'chalk';
import { logError } from '../utils/util'

Mustache.Writer.prototype.splitPipe  = function (value){
    const pipe = "|";
    let trim = (string) => string.trim();

    if(value.includes(pipe)) return value.split(pipe).map(trim);

    return [value];
}

Mustache.Writer.prototype.pipe  = function (value, pipes){
    if(value == null) return value;

    return pipes.reduce((ant,functionName)=>{
        if(pipeFuncions.hasOwnProperty(functionName)){
            return pipeFuncions[functionName](ant);
        }

        logError(`Pipeline >${functionName}<< not found.`)
        return ant;
    },value)
}

Mustache.Writer.prototype.escapedValue = function escapedValue (token, context) {
    let [,tokenValue]    = token
    let [name, ...pipes] = this.splitPipe(tokenValue)
    let contextValue     = context.lookup(name);

    let finalValue       = this.pipe(contextValue, pipes)

    if (finalValue != null)
      return Mustache.escape(finalValue);
  };

export default Mustache