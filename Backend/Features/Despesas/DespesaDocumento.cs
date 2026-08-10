namespace Template.Features.Despesas;

public class DespesaDocumento
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime Data { get; set; }
    public string Documento { get; set; } = string.Empty;
    public string LocalizadorGasto { get; set; } = string.Empty;
    public string Fase { get; set; } = string.Empty;
    public string Especie { get; set; } = string.Empty;
    public string Favorecido { get; set; } = string.Empty;
    public string UfFavorecido { get; set; } = string.Empty;
    public string Ug { get; set; } = string.Empty;
    public string UnidadeOrcamentaria { get; set; } = string.Empty;
    public string Orgao { get; set; } = string.Empty;
    public string OrgaoSuperior { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string GrupoDespesa { get; set; } = string.Empty;
    public string ElementoDespesa { get; set; } = string.Empty;
    public string ModalidadeDespesa { get; set; } = string.Empty;
    public string PlanoOrcamentario { get; set; } = string.Empty;
    public string AutorEmenda { get; set; } = string.Empty;
    public string Funcao { get; set; } = string.Empty;
    public string Subfuncao { get; set; } = string.Empty;
    public string Subtitulo { get; set; } = string.Empty;
    public string ProgramaGoverno { get; set; } = string.Empty;
    public string Acao { get; set; } = string.Empty;
}
