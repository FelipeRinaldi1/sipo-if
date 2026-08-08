using Microsoft.EntityFrameworkCore;
using Template.Features.Items;

namespace Template.Data;

public static class DataExtensions
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<TemplateContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<TemplateContext>>();
        
        int retries = 10;
        while (retries > 0)
        {
            try
            {
                logger.LogInformation("Tentando aplicar as migrations no banco de dados...");
                dbContext.Database.Migrate();
                logger.LogInformation("Migrations aplicadas com sucesso!");
                break;
            }
            catch (Exception ex)
            {
                retries--;
                logger.LogWarning($"Aguardando o PostgreSQL iniciar e criar o banco de dados... ({retries} tentativas restantes). Erro: {ex.Message}");
                if (retries == 0)
                {
                    logger.LogError("Não foi possível conectar ao PostgreSQL após várias tentativas.");
                    throw;
                }
                System.Threading.Thread.Sleep(5000);
            }
        }
    }

    public static void AddTemplateDb(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration.GetConnectionString("Template");
        builder.Services.AddDbContext<TemplateContext>(options =>
            options.UseNpgsql(connString)
                   .UseSeeding((context, _) =>
                   {
                       if (!context.Set<Item>().Any())
                       {
                           context.Set<Item>().AddRange(
                               new Item { Name = "Item Exemplo A", Description = "Descrição do Item Exemplo A", Price = 9.99m, CreatedAt = DateTime.UtcNow },
                               new Item { Name = "Item Exemplo B", Description = "Descrição do Item Exemplo B", Price = 19.99m, CreatedAt = DateTime.UtcNow }
                           );
                           context.SaveChanges();
                       }
                   })
        );
    }
}
