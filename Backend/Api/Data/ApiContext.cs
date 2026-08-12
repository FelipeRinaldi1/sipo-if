using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Api.Features.Despesas;
using Api.Features.Items;
using Api.Features.Users;

namespace Api.Data;

public class ApiContext(DbContextOptions<ApiContext> options)
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Item> Items { get; set; }
    public DbSet<DespesaPorOrgao> DespesasPorOrgao { get; set; }
    public DbSet<DespesaPorProgramaAcao> DespesasPorProgramaAcao { get; set; }
    public DbSet<DespesaDocumento> DespesasDocumento { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure the UserRole enum to be stored as a string in the database
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(50);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApiContext).Assembly);
    }
}