public class {{android:class}} extends ModelsEncerrar {
    {{#android-attr-class}}
        {{#foreignKey}}
            private ArrayList<{{fkTableName}}> {{name}}
        {{/foreignKey}}
        {{^foreignKey}}
            private {{type}} {{name}};
        {{/foreignKey}}
    {{/android-attr-class}}

    {{#android-attr-class}}
    public {{type}} get{{name}}() {
        return {{name}};
    }

    public void set{{name}}({{type}} {{name}}) {
        this.{{name}} = {{name}};
    }
    {{/android-attr-class}}
}