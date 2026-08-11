using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Features.Despesas;
using Xunit;

namespace Backend.Tests;

public class GestaoFornecedoresTests
{
    private TemplateContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TemplateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new TemplateContext(options);
    }

    [Fact(DisplayName = "AC-008 — Ranking dos Maiores Fornecedores Credores @spec:AC-008")]
    public async Task GetDespesasFornecedores_DeveRetornarTopFornecedoresOrdenados()
    {
        using var context = GetInMemoryContext();
        context.DespesasDocumento.AddRange(
            new DespesaDocumento
            {
                Favorecido = "FORNECEDOR A",
                Valor = 50000m,
                Fase = "Pagamento",
                GrupoDespesa = "3",
                ElementoDespesa = "37 - Locação de Mão-de-Obra"
            },
            new DespesaDocumento
            {
                Favorecido = "FORNECEDOR B",
                Valor = 150000m,
                Fase = "Pagamento",
                GrupoDespesa = "3",
                ElementoDespesa = "39 - Outros Serviços"
            },
            new DespesaDocumento
            {
                Favorecido = "FORNECEDOR A",
                Valor = 30000m,
                Fase = "Pagamento",
                GrupoDespesa = "3",
                ElementoDespesa = "37 - Locação de Mão-de-Obra"
            }
        );
        await context.SaveChangesAsync();

        var service = new DespesasFornecedoresService(context);
        var resumo = await service.GetResumoFornecedoresAsync();

        Assert.NotNull(resumo);
        Assert.True(resumo.TopFornecedores.Count >= 2);

        var top1 = resumo.TopFornecedores[0];
        Assert.Equal("FORNECEDOR B", top1.Favorecido);
        Assert.Equal(150000m, top1.TotalPago);

        var top2 = resumo.TopFornecedores[1];
        Assert.Equal("FORNECEDOR A", top2.Favorecido);
        Assert.Equal(80000m, top2.TotalPago);
    }

    [Fact(DisplayName = "AC-009 — Agrupamento por Elemento de Despesa @spec:AC-009")]
    public async Task GetDespesasFornecedores_DeveAgruparPorElementoDespesa()
    {
        using var context = GetInMemoryContext();
        context.DespesasDocumento.AddRange(
            new DespesaDocumento
            {
                Favorecido = "FORNECEDOR A",
                Valor = 20000m,
                ElementoDespesa = "37 - Locação de Mão-de-Obra"
            },
            new DespesaDocumento
            {
                Favorecido = "FORNECEDOR B",
                Valor = 30000m,
                ElementoDespesa = "37 - Locação de Mão-de-Obra"
            },
            new DespesaDocumento
            {
                Favorecido = "FORNECEDOR C",
                Valor = 40000m,
                ElementoDespesa = "52 - Equipamentos"
            }
        );
        await context.SaveChangesAsync();

        var service = new DespesasFornecedoresService(context);
        var resumo = await service.GetResumoFornecedoresAsync();

        Assert.NotNull(resumo.ElementosDespesa);
        var maoDeObra = resumo.ElementosDespesa.FirstOrDefault(e => e.Elemento.Contains("37"));
        Assert.NotNull(maoDeObra);
        Assert.Equal(50000m, maoDeObra.TotalPago);

        var equipamentos = resumo.ElementosDespesa.FirstOrDefault(e => e.Elemento.Contains("52"));
        Assert.NotNull(equipamentos);
        Assert.Equal(40000m, equipamentos.TotalPago);
    }
}
