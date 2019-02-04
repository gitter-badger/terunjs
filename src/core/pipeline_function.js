
import ConfigManager from './configManager';
import { capitalize, firstLower, underscore, clearWhitespace } from '../utils/util';


// Caso seja necessário adicionais mais funções default adicione em `default_functions`
let custom_functions = ConfigManager.getPipelineFunctionsFile();
let default_functions = {
    upper:function(value){
        return value.toUpperCase()
    },
    lower:function(value){
        return value.toLowerCase()
    },
    underscore:function(value){
        return underscore(value);
    },
    firstlower:function(value){
        return firstLower(value);
    },
    capitalize: function(value){
        return capitalize(value)
    },
    clearwhitespace:function(value){
        return clearWhitespace(value)
    }
}

if(custom_functions){
    default_functions = Object.assign(default_functions,custom_functions)
}

export default default_functions;
