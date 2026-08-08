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
        builder.Services.AddAuthentication();
        builder.Services.AddAuthorization();
        
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
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://4200" };
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
