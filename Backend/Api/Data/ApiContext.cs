using Microsoft.EntityFrameworkCore;
using Api.Features.Despesas;

namespace Api.Data;

public class ApiContext(DbContextOptions<ApiContext> options)
    : DbContext(options)
{
    public DbSet<DespesaPorOrgao> DespesasPorOrgao { get; set; }
    public DbSet<DespesaPorProgramaAcao> DespesasPorProgramaAcao { get; set; }
    public DbSet<DespesaDocumento> DespesasDocumento { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApiContext).Assembly);
    }
}