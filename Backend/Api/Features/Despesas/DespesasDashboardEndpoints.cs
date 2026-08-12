using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Api.Features.Despesas;

public static class DespesasDashboardEndpoints
{
    public static void MapDespesasDashboardEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/despesas").WithTags("Despesas Dashboard");

        group.MapGet("/resumo-execucao", async (DespesasDashboardService service) =>
        {
            var resultado = await service.GetResumoExecucaoAsync();
            return Results.Ok(resultado);
        })
        .WithName("GetResumoExecucao")
        .Produces<ResumoExecucaoDto>(StatusCodes.Status200OK);
    }
}
