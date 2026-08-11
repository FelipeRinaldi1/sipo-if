using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Features.Despesas;
using Xunit;

namespace Backend.Tests;

public class ExtratoDocumentosTests
{
    private TemplateContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TemplateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new TemplateContext(options);
    }

    [Fact(DisplayName = "AC-010 — Tabela Paginada do Extrato de Documentos @spec:AC-010")]
    public async Task GetDocumentosPaginado_DeveRetornarPaginaEDadosCorretos()
    {
        using var context = GetInMemoryContext();
        for (int i = 1; i <= 25; i++)
        {
            context.DespesasDocumento.Add(new DespesaDocumento
            {
                Documento = $"DOC-{i:D3}",
                Favorecido = $"EMPRESA {i}",
                Valor = i * 100m,
                Fase = "Pagamento"
            });
        }
        await context.SaveChangesAsync();

        var service = new DespesasDocumentosService(context);
        var resultado = await service.GetDocumentosPaginadoAsync(busca: null, pagina: 1, tamanhoPagina: 10);

        Assert.NotNull(resultado);
        Assert.Equal(25, resultado.TotalRegistros);
        Assert.Equal(10, resultado.Itens.Count);
        Assert.Equal(1, resultado.Pagina);
        Assert.Equal(3, resultado.TotalPaginas);
    }

    [Fact(DisplayName = "AC-011 — Filtro e Busca Rapida de Documentos por Fornecedor ou Documento @spec:AC-011")]
    public async Task GetDocumentosPaginado_DeveFiltrarPorTextoBusca()
    {
        using var context = GetInMemoryContext();
        context.DespesasDocumento.AddRange(
            new DespesaDocumento { Documento = "158716264392025DF000001", Favorecido = "ALFA SEGURANCA LTDA", Valor = 1000m },
            new DespesaDocumento { Documento = "158716264392025DF000002", Favorecido = "BETA ALIMENTOS S.A.", Valor = 2000m },
            new DespesaDocumento { Documento = "999999", Favorecido = "ALFA MANUTENCAO EIRELI", Valor = 1500m }
        );
        await context.SaveChangesAsync();

        var service = new DespesasDocumentosService(context);

        // Busca por nome "ALFA"
        var resultadoAlfa = await service.GetDocumentosPaginadoAsync(busca: "ALFA", pagina: 1, tamanhoPagina: 10);
        Assert.Equal(2, resultadoAlfa.TotalRegistros);
        Assert.All(resultadoAlfa.Itens, item => Assert.Contains("ALFA", item.Favorecido));

        // Busca por numero do documento
        var resultadoDoc = await service.GetDocumentosPaginadoAsync(busca: "DF000002", pagina: 1, tamanhoPagina: 10);
        Assert.Equal(1, resultadoDoc.TotalRegistros);
        Assert.Equal("158716264392025DF000002", resultadoDoc.Itens[0].Documento);
    }
}
