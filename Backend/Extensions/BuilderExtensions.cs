namespace Template.Extensions;

using Template.Data;

public static class BuilderExtensions
{
    public static void AddArchitectures(this WebApplicationBuilder builder)
    {
        builder.AddTemplateDb();
    }

    public static void AddServices(this WebApplicationBuilder builder)
    {
        builder.AddCors();
        builder.Services.AddOpenApi();
        builder.Services.AddHealthChecks();
    }

    private static WebApplicationBuilder AddCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        return builder;
    }
}
