import { capitalize, pluralName } from '../utils/util'

export default class Functions {
    constructor() {
        this.functions = {
            "plural": pluralName,
            "upper": function () {
                return function (text, render) {
                    return render(text.toUpperCase());
                }
            },
            "lower": function () {
                return function (text, render) {
                    return render(text.toLoweCase());
                }
            },
            "capitalize": capitalize
        }
    }
}