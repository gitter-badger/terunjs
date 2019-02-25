
import ConfigManager from './configManager';
import {
  capitalize,
  firstLower,
  underscore,
  clearWhitespace,
  lowerCase,
  upperCase
 } from '../utils/util';


// Caso seja necessário adicionais mais funções default adicione em `default_functions`
let custom_functions = ConfigManager.getPipelineFunctionsFile();
let default_functions = {
    upper:function(value){
        return value |> upperCase;
    },
    lower:function(value){
        return value |> lowerCase;
    },
    underscore:function(value){
        return value |> underscore;
    },
    firstlower:function(value){
        return value |> firstLower;
    },
    capitalize: function(value){
        return value |> capitalize;
    },
    clearwhitespace:function(value){
        return value |> clearWhitespace;
    }
}

if(custom_functions){
    default_functions = Object.assign(default_functions,custom_functions)
}

export default default_functions;
