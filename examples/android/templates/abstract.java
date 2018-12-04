public class Abstract{{android:class}}DAO extends {{android:class}}DAO<{{android:class}}> {

    public Abstract{{android:class}}DAO(Context context) {
        super(context);
    }

    @Override
    public String getCreateSQL() {
        
    }


    @Override
    protected String getTableName() {
        return "{{android:tableName}}";
    }

    @Override
    protected {{android:class}} createModel() {
        return new {{android:class}}();
    }

    @Override
    protected void fillModel({{android:class}} item, Cursor cursor) {
        item.setId(cursor.isNull(cursor.getColumnIndex("ID")) ? null : cursor.getLong(cursor.getColumnIndex("ID")));
    }

    @Override
    protected void fillContentValues(ContentValues values, {{android:class}} model) {
        {{#android-attr-class}}
        values.put({{name}}, model.get{{name}}());
        {{/android-attr-class}}
    }


    @Override
    public Long save( {{android:class}} model ) {
        if(model.getTipo().equals("OC")) {
            if (model.getCpf() == null) {
                //é de OC e não tem CPF, não registro, pra evitar duplicidade.
                return null;
            }

            List<EnvolvidoCadastrado> envolvidosOLds = loadBySql("SELECT * FROM " + getTableName() + " WHERE  cpf = ?", model.getCpf());
            if (envolvidosOLds != null && !envolvidosOLds.isEmpty()) {
                //achou um envolvido com Mesmo cpf que o que esta sendo registrado, atualiza as informações dele.
                Long idEnvolvidoOld = envolvidosOLds.get(0).getId();
                model.setId(idEnvolvidoOld);
            }

            return save(model, false);
        }else{
            return save(model, true);
        }
    }
}