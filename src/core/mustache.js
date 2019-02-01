import Mustache from 'mustache';
import { pipe, splitPipe } from './pipeline';

Mustache.Writer.prototype.escapedValue = function escapedValue (token, context) {
    let [,tokenValue]    = token
    let [name, ...pipes] = splitPipe(tokenValue)
    let contextValue     = context.lookup(name);

    let finalValue       = pipe(contextValue, pipes)

    if (finalValue != null)
      return Mustache.escape(finalValue);
};

export default Mustache