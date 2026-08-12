using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public static class DataExtensions
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApiContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApiContext>>();
        
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
                    var importService = scope.ServiceProvider.GetRequiredService<Api.Features.Despesas.DespesasImportService>();
                    var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "2025");
                    if (!Directory.Exists(uploadsDir))
                    {
                        uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "..", "uploads", "2025");
                    }
                    if (!Directory.Exists(uploadsDir))
                    {
                        uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "uploads", "2025");
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

    public static void AddApiDb(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration.GetConnectionString("Api");
        builder.Services.AddDbContext<ApiContext>(options =>
            options.UseNpgsql(connString)
                   .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning))
        );
    }
}
