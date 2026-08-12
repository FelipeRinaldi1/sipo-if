using Api.Features.Despesas;
using Scalar.AspNetCore;

namespace Api.Extensions;

public static class AppExtensions
{
    public static void UseExtensions(this WebApplication app)
    {
        app.UseCors();
        app.MapOpenApi();
        app.MapScalarApiReference();
        app.MapHealthChecks("/health");
    }

    public static void UseMapRoutes(this WebApplication app)
    {
        app.MapDespesasDashboardEndpoints();
        app.MapDespesasProgramaEndpoints();
        app.MapDespesasFornecedoresEndpoints();
    }
}
