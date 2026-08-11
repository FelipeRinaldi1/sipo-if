using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Features.Despesas;
using Xunit;

namespace Backend.Tests;

public class GraficosTests
{
    private TemplateContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TemplateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new TemplateContext(options);
    }

    [Fact(DisplayName = "AC-014 — Distribuicao por Elemento de Despesa agrupada corretamente @spec:AC-014")]
    public async Task GetResumoFornecedores_DeveAgruparElementosDespesa()
    {
        using var context = GetInMemoryContext();
        context.DespesasDocumento.AddRange(
            new DespesaDocumento
            {
                Fase = "Pagamento",
                Favorecido = "EMP-A",
                Valor = 5000m,
                ElementoDespesa = "18 - Auxílio Financeiro a Estudantes"
            },
            new DespesaDocumento
            {
                Fase = "Pagamento",
                Favorecido = "EMP-B",
                Valor = 3000m,
                ElementoDespesa = "18 - Auxílio Financeiro a Estudantes"
            },
            new DespesaDocumento
            {
                Fase = "Pagamento",
                Favorecido = "EMP-C",
                Valor = 2000m,
                ElementoDespesa = "37 - Locação de Mão-de-Obra"
            }
        );
        await context.SaveChangesAsync();

        var service = new DespesasFornecedoresService(context);
        var resultado = await service.GetResumoFornecedoresAsync();

        Assert.NotNull(resultado.ElementosDespesa);
        Assert.Equal(2, resultado.ElementosDespesa.Count);

        var auxilio = resultado.ElementosDespesa.First(e => e.Elemento.Contains("Auxílio"));
        Assert.Equal(8000m, auxilio.TotalPago);
        Assert.Equal(2, auxilio.QuantidadeLancamentos);

        var locacao = resultado.ElementosDespesa.First(e => e.Elemento.Contains("Locação"));
        Assert.Equal(2000m, locacao.TotalPago);
    }

    [Fact(DisplayName = "AC-015 — Top 5 fornecedores por valor pago ordenados decrescente @spec:AC-015")]
    public async Task GetResumoFornecedores_DeveRetornarTop5FornecedoresOrdenados()
    {
        using var context = GetInMemoryContext();
        // Cria 7 fornecedores para garantir que só os top 5 retornam
        for (int i = 1; i <= 7; i++)
        {
            context.DespesasDocumento.Add(new DespesaDocumento
            {
                Fase = "Pagamento",
                Favorecido = $"Fornecedor-{i:D2}",
                Valor = i * 1000m,
                ElementoDespesa = "39 - Outros Serviços"
            });
        }
        await context.SaveChangesAsync();

        var service = new DespesasFornecedoresService(context);
        var resultado = await service.GetResumoFornecedoresAsync();

        Assert.NotNull(resultado.TopFornecedores);
        Assert.Equal(5, resultado.TopFornecedores.Count);

        // O maior fornecedor (Fornecedor-07 com R$7.000) deve ser o primeiro
        Assert.Equal("Fornecedor-07", resultado.TopFornecedores[0].Favorecido);
        Assert.Equal(7000m, resultado.TopFornecedores[0].TotalPago);

        // Deve estar ordenado decrescente
        for (int i = 0; i < resultado.TopFornecedores.Count - 1; i++)
        {
            Assert.True(resultado.TopFornecedores[i].TotalPago >= resultado.TopFornecedores[i + 1].TotalPago);
        }
    }
}
