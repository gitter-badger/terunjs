import pipelineFunctions from './pipeline_function.js';
import { logError, nullOrUndefined } from '../utils/util';


function splitPipe(value){
    if(nullOrUndefined(value)) return []
    
    const pipe = "|";
    let trim = (string) => string.trim();

    if(value.includes(pipe)) return value.split(pipe).map(trim);

    return [value];
}

function pipe (value, pipes){
    if(nullOrUndefined(value)) return value;
    if(nullOrUndefined(pipes)) return value;

    return pipes.reduce((ant,functionName)=>{
        if(pipelineFunctions.hasOwnProperty(functionName)){
            return pipelineFunctions[functionName](ant);
        }

        logError(`Pipeline > ${functionName} < not found.`)

        return ant;
    },value)
}

export { splitPipe, pipe }