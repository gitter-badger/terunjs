public class AtendimentoEncerramento extends ModelsEncerrar {
            private Integer dataHoraIncerta;
            private Integer versaoEncerramento;
            private Integer id;
            private ArrayList<AtendimentoUnidade> idAtendimentoUnidade
            private ArrayList<Usuario> idUsuarioEncerramento
            private String descricaoEncerramentoVarchar;
            private Date dataHoraEncerramento;
            private Integer status;
            private ArrayList<Usuario> idUsuarioHomologacao
            private Date dataHoraHomologacao;
            private ArrayList<Usuario> idUsuarioGerarImprensa
            private Date dataHoraGerarImprensa;
            private Integer idUsuarioFinalizacao;
            private Date dataHoraFinalizacao;
            private Integer finalizado;
            private Integer gerarImprensa;
            private ArrayList<Intercorrencia> idIntercorrencia
            private ArrayList<TipoAtendimento> idTipoAtendimento
            private ArrayList<ClassificacaoAtendimento> idClassificacaoAtendimento
            private ArrayList<CodigoFechamento> idCodigoFechamento
            private Integer tipoClassificAtendimento;
            private Date dataHoraReabertura;
            private Integer idUsuarioReabertura;
            private Integer idUsuarioEdicao;
            private Date dataHoraEdicao;
            private Date dataHoraFato;
            private String providenciasAdotadas;
            private Integer lidoSetorInteligencia;
            private Integer mobileEncerrou;
            private Integer qtdFoto;
            private Integer qtdVideo;
            private Integer qtdAudio;
            private  descricaoEncerramento;

    public Integer getdataHoraIncerta() {
        return dataHoraIncerta;
    }

    public void setdataHoraIncerta(Integer dataHoraIncerta) {
        this.dataHoraIncerta = dataHoraIncerta;
    }
    public Integer getversaoEncerramento() {
        return versaoEncerramento;
    }

    public void setversaoEncerramento(Integer versaoEncerramento) {
        this.versaoEncerramento = versaoEncerramento;
    }
    public Integer getid() {
        return id;
    }

    public void setid(Integer id) {
        this.id = id;
    }
    public Integer getidAtendimentoUnidade() {
        return idAtendimentoUnidade;
    }

    public void setidAtendimentoUnidade(Integer idAtendimentoUnidade) {
        this.idAtendimentoUnidade = idAtendimentoUnidade;
    }
    public Integer getidUsuarioEncerramento() {
        return idUsuarioEncerramento;
    }

    public void setidUsuarioEncerramento(Integer idUsuarioEncerramento) {
        this.idUsuarioEncerramento = idUsuarioEncerramento;
    }
    public String getdescricaoEncerramentoVarchar() {
        return descricaoEncerramentoVarchar;
    }

    public void setdescricaoEncerramentoVarchar(String descricaoEncerramentoVarchar) {
        this.descricaoEncerramentoVarchar = descricaoEncerramentoVarchar;
    }
    public Date getdataHoraEncerramento() {
        return dataHoraEncerramento;
    }

    public void setdataHoraEncerramento(Date dataHoraEncerramento) {
        this.dataHoraEncerramento = dataHoraEncerramento;
    }
    public Integer getstatus() {
        return status;
    }

    public void setstatus(Integer status) {
        this.status = status;
    }
    public Integer getidUsuarioHomologacao() {
        return idUsuarioHomologacao;
    }

    public void setidUsuarioHomologacao(Integer idUsuarioHomologacao) {
        this.idUsuarioHomologacao = idUsuarioHomologacao;
    }
    public Date getdataHoraHomologacao() {
        return dataHoraHomologacao;
    }

    public void setdataHoraHomologacao(Date dataHoraHomologacao) {
        this.dataHoraHomologacao = dataHoraHomologacao;
    }
    public Integer getidUsuarioGerarImprensa() {
        return idUsuarioGerarImprensa;
    }

    public void setidUsuarioGerarImprensa(Integer idUsuarioGerarImprensa) {
        this.idUsuarioGerarImprensa = idUsuarioGerarImprensa;
    }
    public Date getdataHoraGerarImprensa() {
        return dataHoraGerarImprensa;
    }

    public void setdataHoraGerarImprensa(Date dataHoraGerarImprensa) {
        this.dataHoraGerarImprensa = dataHoraGerarImprensa;
    }
    public Integer getidUsuarioFinalizacao() {
        return idUsuarioFinalizacao;
    }

    public void setidUsuarioFinalizacao(Integer idUsuarioFinalizacao) {
        this.idUsuarioFinalizacao = idUsuarioFinalizacao;
    }
    public Date getdataHoraFinalizacao() {
        return dataHoraFinalizacao;
    }

    public void setdataHoraFinalizacao(Date dataHoraFinalizacao) {
        this.dataHoraFinalizacao = dataHoraFinalizacao;
    }
    public Integer getfinalizado() {
        return finalizado;
    }

    public void setfinalizado(Integer finalizado) {
        this.finalizado = finalizado;
    }
    public Integer getgerarImprensa() {
        return gerarImprensa;
    }

    public void setgerarImprensa(Integer gerarImprensa) {
        this.gerarImprensa = gerarImprensa;
    }
    public Integer getidIntercorrencia() {
        return idIntercorrencia;
    }

    public void setidIntercorrencia(Integer idIntercorrencia) {
        this.idIntercorrencia = idIntercorrencia;
    }
    public Integer getidTipoAtendimento() {
        return idTipoAtendimento;
    }

    public void setidTipoAtendimento(Integer idTipoAtendimento) {
        this.idTipoAtendimento = idTipoAtendimento;
    }
    public Integer getidClassificacaoAtendimento() {
        return idClassificacaoAtendimento;
    }

    public void setidClassificacaoAtendimento(Integer idClassificacaoAtendimento) {
        this.idClassificacaoAtendimento = idClassificacaoAtendimento;
    }
    public Integer getidCodigoFechamento() {
        return idCodigoFechamento;
    }

    public void setidCodigoFechamento(Integer idCodigoFechamento) {
        this.idCodigoFechamento = idCodigoFechamento;
    }
    public Integer gettipoClassificAtendimento() {
        return tipoClassificAtendimento;
    }

    public void settipoClassificAtendimento(Integer tipoClassificAtendimento) {
        this.tipoClassificAtendimento = tipoClassificAtendimento;
    }
    public Date getdataHoraReabertura() {
        return dataHoraReabertura;
    }

    public void setdataHoraReabertura(Date dataHoraReabertura) {
        this.dataHoraReabertura = dataHoraReabertura;
    }
    public Integer getidUsuarioReabertura() {
        return idUsuarioReabertura;
    }

    public void setidUsuarioReabertura(Integer idUsuarioReabertura) {
        this.idUsuarioReabertura = idUsuarioReabertura;
    }
    public Integer getidUsuarioEdicao() {
        return idUsuarioEdicao;
    }

    public void setidUsuarioEdicao(Integer idUsuarioEdicao) {
        this.idUsuarioEdicao = idUsuarioEdicao;
    }
    public Date getdataHoraEdicao() {
        return dataHoraEdicao;
    }

    public void setdataHoraEdicao(Date dataHoraEdicao) {
        this.dataHoraEdicao = dataHoraEdicao;
    }
    public Date getdataHoraFato() {
        return dataHoraFato;
    }

    public void setdataHoraFato(Date dataHoraFato) {
        this.dataHoraFato = dataHoraFato;
    }
    public String getprovidenciasAdotadas() {
        return providenciasAdotadas;
    }

    public void setprovidenciasAdotadas(String providenciasAdotadas) {
        this.providenciasAdotadas = providenciasAdotadas;
    }
    public Integer getlidoSetorInteligencia() {
        return lidoSetorInteligencia;
    }

    public void setlidoSetorInteligencia(Integer lidoSetorInteligencia) {
        this.lidoSetorInteligencia = lidoSetorInteligencia;
    }
    public Integer getmobileEncerrou() {
        return mobileEncerrou;
    }

    public void setmobileEncerrou(Integer mobileEncerrou) {
        this.mobileEncerrou = mobileEncerrou;
    }
    public Integer getqtdFoto() {
        return qtdFoto;
    }

    public void setqtdFoto(Integer qtdFoto) {
        this.qtdFoto = qtdFoto;
    }
    public Integer getqtdVideo() {
        return qtdVideo;
    }

    public void setqtdVideo(Integer qtdVideo) {
        this.qtdVideo = qtdVideo;
    }
    public Integer getqtdAudio() {
        return qtdAudio;
    }

    public void setqtdAudio(Integer qtdAudio) {
        this.qtdAudio = qtdAudio;
    }
    public  getdescricaoEncerramento() {
        return descricaoEncerramento;
    }

    public void setdescricaoEncerramento( descricaoEncerramento) {
        this.descricaoEncerramento = descricaoEncerramento;
    }
}