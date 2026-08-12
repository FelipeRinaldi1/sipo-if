using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Features.Despesas;
using Xunit;

namespace Api.Tests;

public class DestinacaoEstudantilTests
{
    private ApiContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<ApiContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApiContext(options);
    }

    [Fact(DisplayName = "AC-006 — Calculo de Distribuicao por Acao Orcamentaria (Assistência vs Funcionamento) @spec:AC-006")]
    public async Task GetDespesasPorProgramaAcao_DeveCalcularProporcaoPorAcao()
    {
        using var context = GetInMemoryContext();
        context.DespesasPorProgramaAcao.AddRange(
            new DespesaPorProgramaAcao
            {
                MesAno = "01/2025",
                ProgramaOrcamentario = "5112 - EDUCACAO PROFISSIONAL",
                AcaoOrcamentaria = "2994 - ASSISTENCIA AOS ESTUDANTES",
                ValorEmpenhado = 100000m,
                ValorLiquidado = 50000m,
                ValorPago = 40000m
            },
            new DespesaPorProgramaAcao
            {
                MesAno = "01/2025",
                ProgramaOrcamentario = "5112 - EDUCACAO PROFISSIONAL",
                AcaoOrcamentaria = "20RL - FUNCIONAMENTO DAS INSTITUICOES",
                ValorEmpenhado = 200000m,
                ValorLiquidado = 150000m,
                ValorPago = 120000m
            }
        );
        await context.SaveChangesAsync();

        var service = new DespesasProgramaService(context);
        var resumo = await service.GetResumoProgramaAcaoAsync();

        Assert.NotNull(resumo);
        Assert.Equal(300000m, resumo.TotalGeralEmpenhado);
        Assert.Equal(160000m, resumo.TotalGeralPago);
        Assert.Equal(2, resumo.Acoes.Count);

        var assistencia = resumo.Acoes.FirstOrDefault(a => a.CodigoAcao == "2994");
        Assert.NotNull(assistencia);
        Assert.Equal(40000m, assistencia.TotalPago);

        var funcionamento = resumo.Acoes.FirstOrDefault(a => a.CodigoAcao == "20RL");
        Assert.NotNull(funcionamento);
        Assert.Equal(120000m, funcionamento.TotalPago);
    }

    [Fact(DisplayName = "AC-007 — Evolucao Mensal do Investimento em Assistencia Estudantil @spec:AC-007")]
    public async Task GetDespesasPorProgramaAcao_DeveRetornarEvolucaoMensalAssistencia()
    {
        using var context = GetInMemoryContext();
        context.DespesasPorProgramaAcao.AddRange(
            new DespesaPorProgramaAcao
            {
                MesAno = "02/2025",
                ProgramaOrcamentario = "5112",
                AcaoOrcamentaria = "2994 - ASSISTENCIA AOS ESTUDANTES",
                ValorEmpenhado = 60000m,
                ValorLiquidado = 30000m,
                ValorPago = 25000m
            },
            new DespesaPorProgramaAcao
            {
                MesAno = "01/2025",
                ProgramaOrcamentario = "5112",
                AcaoOrcamentaria = "2994 - ASSISTENCIA AOS ESTUDANTES",
                ValorEmpenhado = 50000m,
                ValorLiquidado = 20000m,
                ValorPago = 15000m
            }
        );
        await context.SaveChangesAsync();

        var service = new DespesasProgramaService(context);
        var resumo = await service.GetResumoProgramaAcaoAsync();

        Assert.NotNull(resumo.EvolucaoAssistenciaMensal);
        Assert.Equal(2, resumo.EvolucaoAssistenciaMensal.Count);
        Assert.Equal("01/2025", resumo.EvolucaoAssistenciaMensal[0].MesAno);
        Assert.Equal(15000m, resumo.EvolucaoAssistenciaMensal[0].ValorPago);
        Assert.Equal("02/2025", resumo.EvolucaoAssistenciaMensal[1].MesAno);
        Assert.Equal(25000m, resumo.EvolucaoAssistenciaMensal[1].ValorPago);
    }
}
