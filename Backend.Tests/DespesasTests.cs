using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Features.Despesas;
using Xunit;

namespace Backend.Tests;

public class DespesasTests
{
    private TemplateContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TemplateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new TemplateContext(options);
    }

    [Fact(DisplayName = "AC-001 — Tabela de Despesas por Orgao possui schema correto @spec:AC-001")]
    public async Task DespesaPorOrgao_PodeSerSalvaERecuperada()
    {
        using var context = GetInMemoryContext();
        var entity = new DespesaPorOrgao
        {
            MesAno = "05/2025",
            OrgaoSuperior = "26000 - Ministério da Educação",
            OrgaoEntidadeVinculada = "26439 - IFSP",
            UnidadeGestora = "158716 - IFSP - CAMPUS JACAREI",
            ValorEmpenhado = 170940.32m,
            ValorLiquidado = 259513.05m,
            ValorPago = 334030.29m,
            ValorRestosAPagarPagos = 2247.91m
        };

        context.DespesasPorOrgao.Add(entity);
        await context.SaveChangesAsync();

        var saved = await context.DespesasPorOrgao.FirstOrDefaultAsync(x => x.Id == entity.Id);
        Assert.NotNull(saved);
        Assert.Equal("05/2025", saved.MesAno);
        Assert.Equal(170940.32m, saved.ValorEmpenhado);
    }

    [Fact(DisplayName = "AC-002 — Tabela de Despesas por Programa Acao possui schema correto @spec:AC-002")]
    public async Task DespesaPorProgramaAcao_PodeSerSalvaERecuperada()
    {
        using var context = GetInMemoryContext();
        var entity = new DespesaPorProgramaAcao
        {
            MesAno = "01/2025",
            ProgramaOrcamentario = "5112 - EDUCACAO PROFISSIONAL E TECNOLOGICA QUE TRANSFORMA",
            AcaoOrcamentaria = "2994 - ASSISTENCIA AOS ESTUDANTES",
            UnidadeGestora = "158716 - IFSP - CAMPUS JACAREI",
            ValorEmpenhado = 145734.54m,
            ValorLiquidado = 98972.00m,
            ValorPago = 63417.00m,
            ValorRestosAPagarPagos = 0.00m
        };

        context.DespesasPorProgramaAcao.Add(entity);
        await context.SaveChangesAsync();

        var saved = await context.DespesasPorProgramaAcao.FirstOrDefaultAsync(x => x.Id == entity.Id);
        Assert.NotNull(saved);
        Assert.Equal("5112 - EDUCACAO PROFISSIONAL E TECNOLOGICA QUE TRANSFORMA", saved.ProgramaOrcamentario);
        Assert.Equal(145734.54m, saved.ValorEmpenhado);
    }

    [Fact(DisplayName = "AC-003 — Tabela de Despesas Documento possui schema correto @spec:AC-003")]
    public async Task DespesaDocumento_PodeSerSalvaERecuperada()
    {
        using var context = GetInMemoryContext();
        var entity = new DespesaDocumento
        {
            Data = new DateTime(2025, 1, 16, 0, 0, 0, DateTimeKind.Utc),
            Documento = "158716264392025DF800002",
            LocalizadorGasto = "0035 - FUNCIONAMENTO DAS INSTITUICOES",
            Fase = "Pagamento",
            Especie = "Original",
            Favorecido = "30.737.359/0001-07 - RAGNAR SEGURANCA LTDA",
            UfFavorecido = "SP",
            Ug = "IFSP - CAMPUS JACAREI",
            UnidadeOrcamentaria = "INST.FED.DE EDUC.,CIENC.E TEC.DE SAO PAULO",
            Orgao = "Instituto Federal de Educação, Ciência e Tecnologia de São Paulo",
            OrgaoSuperior = "Ministério da Educação",
            Valor = 4472.91m,
            GrupoDespesa = "3 - Outras Despesas Correntes",
            ElementoDespesa = "37 - Locação de Mão-de-Obra",
            ModalidadeDespesa = "90 - Aplicações Diretas",
            PlanoOrcamentario = "0000 - DESPESAS DIVERSAS",
            AutorEmenda = "0000",
            Funcao = "12 - Educação",
            Subfuncao = "363 - Ensino profissional",
            Subtitulo = "20RL0035",
            ProgramaGoverno = "5112 - EDUCACAO PROFISSIONAL",
            Acao = "20RL - FUNCIONAMENTO"
        };

        context.DespesasDocumento.Add(entity);
        await context.SaveChangesAsync();

        var saved = await context.DespesasDocumento.FirstOrDefaultAsync(x => x.Id == entity.Id);
        Assert.NotNull(saved);
        Assert.Equal("158716264392025DF800002", saved.Documento);
        Assert.Equal(4472.91m, saved.Valor);
    }
}
