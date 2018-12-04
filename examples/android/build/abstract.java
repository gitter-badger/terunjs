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
        values.put(dataHoraIncerta, model.getdataHoraIncerta());
        values.put(versaoEncerramento, model.getversaoEncerramento());
        values.put(id, model.getid());
        values.put(idAtendimentoUnidade, model.getidAtendimentoUnidade());
        values.put(idUsuarioEncerramento, model.getidUsuarioEncerramento());
        values.put(descricaoEncerramentoVarchar, model.getdescricaoEncerramentoVarchar());
        values.put(dataHoraEncerramento, model.getdataHoraEncerramento());
        values.put(status, model.getstatus());
        values.put(idUsuarioHomologacao, model.getidUsuarioHomologacao());
        values.put(dataHoraHomologacao, model.getdataHoraHomologacao());
        values.put(idUsuarioGerarImprensa, model.getidUsuarioGerarImprensa());
        values.put(dataHoraGerarImprensa, model.getdataHoraGerarImprensa());
        values.put(idUsuarioFinalizacao, model.getidUsuarioFinalizacao());
        values.put(dataHoraFinalizacao, model.getdataHoraFinalizacao());
        values.put(finalizado, model.getfinalizado());
        values.put(gerarImprensa, model.getgerarImprensa());
        values.put(idIntercorrencia, model.getidIntercorrencia());
        values.put(idTipoAtendimento, model.getidTipoAtendimento());
        values.put(idClassificacaoAtendimento, model.getidClassificacaoAtendimento());
        values.put(idCodigoFechamento, model.getidCodigoFechamento());
        values.put(tipoClassificAtendimento, model.gettipoClassificAtendimento());
        values.put(dataHoraReabertura, model.getdataHoraReabertura());
        values.put(idUsuarioReabertura, model.getidUsuarioReabertura());
        values.put(idUsuarioEdicao, model.getidUsuarioEdicao());
        values.put(dataHoraEdicao, model.getdataHoraEdicao());
        values.put(dataHoraFato, model.getdataHoraFato());
        values.put(providenciasAdotadas, model.getprovidenciasAdotadas());
        values.put(lidoSetorInteligencia, model.getlidoSetorInteligencia());
        values.put(mobileEncerrou, model.getmobileEncerrou());
        values.put(qtdFoto, model.getqtdFoto());
        values.put(qtdVideo, model.getqtdVideo());
        values.put(qtdAudio, model.getqtdAudio());
        values.put(descricaoEncerramento, model.getdescricaoEncerramento());
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