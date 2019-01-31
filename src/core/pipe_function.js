
import ConfigManager from '../core/configManager';
import {capitalize,firstLower} from '../utils/util';

let custom_functions = ConfigManager.getPipeFunctions();
let default_functions = {
    upper:function(value){
        return value.toUpperCase()
    },
    lower:function(value){
        return value.toLowerCase()
    },
    underscore:function(value){
        value = firstLower(value);
        let put_underscore = (letter)=>{
            if(letter.match(/[A-Z]/g)){
                return `_${letter.toLowerCase()}`;
            }else{
                return letter;
            }
        }

        return value.split('').map(put_underscore).join('')
    },
    firstlower:function(value){
        return firstLower(value);
    },
    capitalize: function(value){
        return capitalize(value)
    }
}

if(custom_functions){
    default_functions = Object.assign(default_functions,custom_functions)
}

export default default_functions;
