using Template.Features.Despesas;
using Template.Features.Items;
using Template.Features.Users;
using Scalar.AspNetCore;

namespace Template.Extensions;

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
        app.MapIdentityApi<User>();
        app.MapItemsEndpoints();
        app.MapUsersEndpoints();
        app.MapDespesasDashboardEndpoints();
        app.MapDespesasProgramaEndpoints();
        app.MapDespesasFornecedoresEndpoints();
    }
}
