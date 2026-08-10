using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Features.Despesas;
using Xunit;

namespace Backend.Tests;

public class PainelExecucaoTests
{
    private TemplateContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TemplateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new TemplateContext(options);
    }

    [Fact(DisplayName = "AC-004 — Calculo de Metricas Globais da Despesa @spec:AC-004")]
    public async Task GetResumoExecucao_DeveCalcularMetricasGlobais()
    {
        using var context = GetInMemoryContext();
        context.DespesasPorOrgao.AddRange(
            new DespesaPorOrgao
            {
                MesAno = "01/2025",
                ValorEmpenhado = 100000m,
                ValorLiquidado = 80000m,
                ValorPago = 70000m,
                ValorRestosAPagarPagos = 5000m
            },
            new DespesaPorOrgao
            {
                MesAno = "02/2025",
                ValorEmpenhado = 200000m,
                ValorLiquidado = 150000m,
                ValorPago = 130000m,
                ValorRestosAPagarPagos = 10000m
            }
        );
        await context.SaveChangesAsync();

        var service = new DespesasDashboardService(context);
        var resumo = await service.GetResumoExecucaoAsync();

        Assert.NotNull(resumo);
        Assert.Equal(300000m, resumo.TotalEmpenhado);
        Assert.Equal(230000m, resumo.TotalLiquidado);
        Assert.Equal(200000m, resumo.TotalPago);
        Assert.Equal(15000m, resumo.TotalRestosAPagarPagos);
    }

    [Fact(DisplayName = "AC-005 — Evolucao Mensal do Orcamento Agrupada por Mes @spec:AC-005")]
    public async Task GetResumoExecucao_DeveRetornarEvolucaoMensalOrdenada()
    {
        using var context = GetInMemoryContext();
        context.DespesasPorOrgao.AddRange(
            new DespesaPorOrgao
            {
                MesAno = "02/2025",
                ValorEmpenhado = 200m,
                ValorLiquidado = 150m,
                ValorPago = 100m,
                ValorRestosAPagarPagos = 0m
            },
            new DespesaPorOrgao
            {
                MesAno = "01/2025",
                ValorEmpenhado = 100m,
                ValorLiquidado = 80m,
                ValorPago = 50m,
                ValorRestosAPagarPagos = 0m
            }
        );
        await context.SaveChangesAsync();

        var service = new DespesasDashboardService(context);
        var resumo = await service.GetResumoExecucaoAsync();

        Assert.NotNull(resumo.EvolucaoMensal);
        Assert.Equal(2, resumo.EvolucaoMensal.Count);
        Assert.Equal("01/2025", resumo.EvolucaoMensal[0].MesAno);
        Assert.Equal(100m, resumo.EvolucaoMensal[0].Empenhado);
        Assert.Equal("02/2025", resumo.EvolucaoMensal[1].MesAno);
        Assert.Equal(200m, resumo.EvolucaoMensal[1].Empenhado);
    }
}
