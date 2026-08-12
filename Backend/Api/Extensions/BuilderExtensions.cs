namespace Api.Extensions;

using Api.Data;
using Api.Features.Users;

public static class BuilderExtensions
{
    public static void AddArchitectures(this WebApplicationBuilder builder)
    {
        builder.AddApiDb();
    }

    public static void AddServices(this WebApplicationBuilder builder)
    {
        builder.AddCors();
        builder.Services.AddOpenApi();
        builder.Services.AddHealthChecks();
        builder.Services.AddAuthorization();
        builder.Services.AddScoped<Api.Features.Despesas.DespesasDashboardService>();
        builder.Services.AddScoped<Api.Features.Despesas.DespesasProgramaService>();
        builder.Services.AddScoped<Api.Features.Despesas.DespesasFornecedoresService>();
        builder.Services.AddScoped<Api.Features.Despesas.DespesasImportService>();
        
        // Configure JSON options to serialize enums as strings in HTTP responses
        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        });

        builder.Services.AddIdentityApiEndpoints<User>()
            .AddEntityFrameworkStores<ApiContext>()
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
