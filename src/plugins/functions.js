import plural from 'pluralize-ptbr'

export default class Functions {
    constructor() {
        this.functions = {
            "plural": function () {
                return function (text, render) {
                    return render(plural(text));
                }
            },
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
            "capitalize": function () {
                return function (text, render) {
                    return render(text.replace(/^\w/, c => c.toUpperCase()));
                }
            }
        }
    }
}