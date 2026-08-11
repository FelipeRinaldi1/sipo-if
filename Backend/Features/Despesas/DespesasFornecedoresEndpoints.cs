using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Template.Features.Despesas;

public static class DespesasFornecedoresEndpoints
{
    public static void MapDespesasFornecedoresEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/despesas").WithTags("Despesas Fornecedores");

        group.MapGet("/fornecedores", async (DespesasFornecedoresService service) =>
        {
            var resultado = await service.GetResumoFornecedoresAsync();
            return Results.Ok(resultado);
        })
        .WithName("GetResumoFornecedores")
        .Produces<ResumoFornecedoresDto>(StatusCodes.Status200OK);
    }
}
