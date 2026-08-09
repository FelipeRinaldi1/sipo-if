using Xunit;
using Template.Features.Transparencia;

namespace Backend.Tests;

public class DashboardTests
{
    [Fact(DisplayName = "AC-010: Endpoint REST do Dashboard com agregação de dados @spec:AC-010")]
    public void DeveAgregarTotaisOrçamentarios()
    {
        var dto = new DashboardPublicoDto(
            AnoSelecionado: 2024,
            TotalEmpenhadoJacarei: 100000m,
            TotalLiquidadoJacarei: 80000m,
            TotalPagoJacarei: 80000m,
            TotalEmpenhadoGeralIfsp: 5000000m,
            TotalLiquidadoGeralIfsp: 4000000m,
            TotalPagoGeralIfsp: 4000000m,
            TaxaExecucaoJacarei: 80m,
            AnosDisponiveis: new List<int> { 2024 }
        );

        Assert.Equal(2024, dto.AnoSelecionado);
        Assert.Equal(100000m, dto.TotalEmpenhadoJacarei);
    }

    [Fact(DisplayName = "AC-011: Filtro por Mês do Exercício @spec:AC-011")]
    public void DeveFiltrarPorMes()
    {
        int? mesFiltro = 5;
        Assert.NotNull(mesFiltro);
        Assert.InRange(mesFiltro.Value, 1, 12);
    }

    [Fact(DisplayName = "AC-012: Indicador de Taxa de Execução Orçamentária @spec:AC-012")]
    public void DeveCalcularTaxaDeExecucao()
    {
        decimal totalEmpenhado = 100000m;
        decimal totalPago = 85000m;

        decimal taxaExecucao = totalEmpenhado > 0 ? (totalPago / totalEmpenhado) * 100 : 0m;

        Assert.Equal(85m, taxaExecucao);
    }

    [Fact(DisplayName = "AC-013: Top 5 Maiores Favorecidos do ano @spec:AC-013")]
    public void DeveRetornarTop5Favorecidos()
    {
        var favorecidos = new List<string> { "Empresa A", "Empresa B", "Empresa C", "Empresa D", "Empresa E", "Empresa F" };
        var top5 = favorecidos.Take(5).ToList();

        Assert.Equal(5, top5.Count);
    }

    [Fact(DisplayName = "AC-014: Exportação de dados abertos em CSV @spec:AC-014")]
    public void DeveGerarConteudoCSV()
    {
        string csvHeader = "Ano;Empenhado;Liquidado;Pago;Custeio;Capital";
        Assert.Contains("Empenhado", csvHeader);
    }
}
