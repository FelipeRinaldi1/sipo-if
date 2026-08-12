using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Api.Features.Despesas;

public static class DespesasProgramaEndpoints
{
    public static void MapDespesasProgramaEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/despesas").WithTags("Despesas Programa/Acao");

        group.MapGet("/programa-acao", async (DespesasProgramaService service) =>
        {
            var resultado = await service.GetResumoProgramaAcaoAsync();
            return Results.Ok(resultado);
        })
        .WithName("GetResumoProgramaAcao")
        .Produces<ResumoProgramaAcaoDto>(StatusCodes.Status200OK);
    }
}
