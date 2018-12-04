public class AbstractAtendimentoEncerramentoDAO extends AtendimentoEncerramentoDAO<AtendimentoEncerramento> {

    public AbstractAtendimentoEncerramentoDAO(Context context) {
        super(context);
    }

    @Override
    public String getCreateSQL() {
        
    }


    @Override
    protected String getTableName() {
        return "ATENDIMENTO_ENCERRAMENTO";
    }

    @Override
    protected AtendimentoEncerramento createModel() {
        return new AtendimentoEncerramento();
    }

    @Override
    protected void fillModel(AtendimentoEncerramento item, Cursor cursor) {
        item.setId(cursor.isNull(cursor.getColumnIndex("ID")) ? null : cursor.getLong(cursor.getColumnIndex("ID")));
    }

    @Override
    protected void fillContentValues(ContentValues values, AtendimentoEncerramento model) {
        values.put(DataHoraIncerta, model.getDataHoraIncerta());
        values.put(VersaoEncerramento, model.getVersaoEncerramento());
        values.put(Id, model.getId());
        values.put(IdAtendimentoUnidade, model.getIdAtendimentoUnidade());
        values.put(IdUsuarioEncerramento, model.getIdUsuarioEncerramento());
        values.put(DescricaoEncerramentoVarchar, model.getDescricaoEncerramentoVarchar());
        values.put(DataHoraEncerramento, model.getDataHoraEncerramento());
        values.put(Status, model.getStatus());
        values.put(IdUsuarioHomologacao, model.getIdUsuarioHomologacao());
        values.put(DataHoraHomologacao, model.getDataHoraHomologacao());
        values.put(IdUsuarioGerarImprensa, model.getIdUsuarioGerarImprensa());
        values.put(DataHoraGerarImprensa, model.getDataHoraGerarImprensa());
        values.put(IdUsuarioFinalizacao, model.getIdUsuarioFinalizacao());
        values.put(DataHoraFinalizacao, model.getDataHoraFinalizacao());
        values.put(Finalizado, model.getFinalizado());
        values.put(GerarImprensa, model.getGerarImprensa());
        values.put(IdIntercorrencia, model.getIdIntercorrencia());
        values.put(IdTipoAtendimento, model.getIdTipoAtendimento());
        values.put(IdClassificacaoAtendimento, model.getIdClassificacaoAtendimento());
        values.put(IdCodigoFechamento, model.getIdCodigoFechamento());
        values.put(TipoClassificAtendimento, model.getTipoClassificAtendimento());
        values.put(DataHoraReabertura, model.getDataHoraReabertura());
        values.put(IdUsuarioReabertura, model.getIdUsuarioReabertura());
        values.put(IdUsuarioEdicao, model.getIdUsuarioEdicao());
        values.put(DataHoraEdicao, model.getDataHoraEdicao());
        values.put(DataHoraFato, model.getDataHoraFato());
        values.put(ProvidenciasAdotadas, model.getProvidenciasAdotadas());
        values.put(LidoSetorInteligencia, model.getLidoSetorInteligencia());
        values.put(MobileEncerrou, model.getMobileEncerrou());
        values.put(QtdFoto, model.getQtdFoto());
        values.put(QtdVideo, model.getQtdVideo());
        values.put(QtdAudio, model.getQtdAudio());
        values.put(DescricaoEncerramento, model.getDescricaoEncerramento());
    }


    @Override
    public Long save( AtendimentoEncerramento model ) {
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