namespace Template.Extensions;

using Template.Data;
using Template.Features.Users;

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
        builder.Services.AddAuthorization();
        builder.Services.AddScoped<Template.Features.Despesas.DespesasDashboardService>();
        builder.Services.AddScoped<Template.Features.Despesas.DespesasProgramaService>();
        builder.Services.AddScoped<Template.Features.Despesas.DespesasFornecedoresService>();
        builder.Services.AddScoped<Template.Features.Despesas.DespesasDocumentosService>();
        builder.Services.AddScoped<Template.Features.Despesas.DespesasImportService>();
        
        // Configure JSON options to serialize enums as strings in HTTP responses
        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        });

        builder.Services.AddIdentityApiEndpoints<User>()
            .AddEntityFrameworkStores<TemplateContext>()
            .AddClaimsPrincipalFactory<CustomClaimsPrincipalFactory>();
    }

    private static WebApplicationBuilder AddCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        return builder;
    }
}
