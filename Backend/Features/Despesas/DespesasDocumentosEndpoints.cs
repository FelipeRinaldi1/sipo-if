using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Template.Features.Despesas;

public static class DespesasDocumentosEndpoints
{
    public static void MapDespesasDocumentosEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/despesas").WithTags("Despesas Documentos Extrato");

        group.MapGet("/documentos", async (
            DespesasDocumentosService service,
            string? busca,
            int? pagina,
            int? tamanhoPagina
        ) =>
        {
            var p = pagina ?? 1;
            var tp = tamanhoPagina ?? 10;
            var resultado = await service.GetDocumentosPaginadoAsync(busca, p, tp);
            return Results.Ok(resultado);
        })
        .WithName("GetDocumentosPaginado")
        .Produces<ResultadoPaginadoDocumentosDto>(StatusCodes.Status200OK);
    }
}
