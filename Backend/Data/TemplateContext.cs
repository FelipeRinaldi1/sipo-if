using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Template.Features.Items;
using Template.Features.Users;
using Template.Features.Transparencia;

namespace Template.Data;

public class TemplateContext(DbContextOptions<TemplateContext> options)
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Item> Items { get; set; }
    public DbSet<DespesaOrcamentaria> DespesasOrcamentarias { get; set; }
    public DbSet<SincronizacaoLog> SincronizacaoLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure the UserRole enum to be stored as a string in the database
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(50);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TemplateContext).Assembly);
    }
}