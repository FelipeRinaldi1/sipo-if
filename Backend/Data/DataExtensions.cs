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
                logger.LogInformation("Garantindo estrutura do banco de dados...");
                dbContext.Database.EnsureCreated();
                logger.LogInformation("Estrutura do banco de dados pronta!");

                if (!dbContext.DespesasPorOrgao.Any())
                {
                    logger.LogInformation("Importando dados dos CSVs em uploads/2025/...");
                    var importService = scope.ServiceProvider.GetRequiredService<Template.Features.Despesas.DespesasImportService>();
                    var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "..", "uploads", "2025");
                    if (!Directory.Exists(uploadsDir))
                    {
                        uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "2025");
                    }
                    if (Directory.Exists(uploadsDir))
                    {
                        var total = importService.ImportAllFromDirectoryAsync(uploadsDir).GetAwaiter().GetResult();
                        logger.LogInformation($"Importados {total} registros de despesas com sucesso!");
                    }
                }
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
                   .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning))
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
