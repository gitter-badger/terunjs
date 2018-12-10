public class {{android:class}} extends ModelsEncerrar {
    {{#android-attr-class}}
        {{#foreignKey}}
            private ArrayList<{{fkTableName}}> {{attr}};
        {{/foreignKey}}
        {{^foreignKey}}
            private {{type}} {{attr}};
        {{/foreignKey}}
    {{/android-attr-class}}

    {{#android-attr-class}}
    public {{type}} get{{name}}() {
        return this.{{attr}};
    }

    public void set{{name}}({{type}} {{attr}}) {
        this.{{attr}} = {{attr}};
    }
    {{/android-attr-class}}
}