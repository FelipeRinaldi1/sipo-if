using Template.Features.Items;

namespace Template.Extensions;

public static class AppExtensions
{
    public static void UseExtensions(this WebApplication app)
    {
        app.UseCors();
        app.MapOpenApi();
        app.MapHealthChecks("/health");
    }

    public static void UseMapRoutes(this WebApplication app)
    {
        app.MapItemsEndpoints();
    }
}
