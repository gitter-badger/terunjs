public class AbstractAcabamentoArmaDAO extends AcabamentoArmaDAO<AcabamentoArma> {

    public AbstractAcabamentoArmaDAO(Context context) {
        super(context);
    }

    @Override
    public String getCreateSQL() {
        
    }


    @Override
    protected String getTableName() {
        return "ACABAMENTO_ARMA";
    }

    @Override
    protected AcabamentoArma createModel() {
        return new AcabamentoArma();
    }

    @Override
    protected void fillModel(AcabamentoArma item, Cursor cursor) {
        item.setId(cursor.isNull(cursor.getColumnIndex("ID")) ? null : cursor.getLong(cursor.getColumnIndex("ID")));
    }

    @Override
    protected void fillContentValues(ContentValues values, AcabamentoArma model) {
        values.put(Descricao, model.getDescricao());
        values.put(DataAtualizacao, model.getDataAtualizacao());
    }


    @Override
    public Long save( AcabamentoArma model ) {
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