namespace Template.Features.Despesas;

public class DespesaPorOrgao
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string MesAno { get; set; } = string.Empty;
    public string OrgaoSuperior { get; set; } = string.Empty;
    public string OrgaoEntidadeVinculada { get; set; } = string.Empty;
    public string UnidadeGestora { get; set; } = string.Empty;
    public decimal ValorEmpenhado { get; set; }
    public decimal ValorLiquidado { get; set; }
    public decimal ValorPago { get; set; }
    public decimal ValorRestosAPagarPagos { get; set; }
}
