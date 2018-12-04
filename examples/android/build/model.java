public class ArmaTipo extends ModelsEncerrar {
    private Integer Id;
    private String Descricao;
    private Integer Excluido;

    public Integer getId() {
        return Id;
    }

    public void setId(Integer Id) {
        this.Id = Id;
    }
    public String getDescricao() {
        return Descricao;
    }

    public void setDescricao(String Descricao) {
        this.Descricao = Descricao;
    }
    public Integer getExcluido() {
        return Excluido;
    }

    public void setExcluido(Integer Excluido) {
        this.Excluido = Excluido;
    }
}