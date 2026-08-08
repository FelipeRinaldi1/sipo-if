using Microsoft.EntityFrameworkCore;
using Template.Features.Items;

namespace Template.Data;

public class TemplateContext(DbContextOptions<TemplateContext> options) 
    : DbContext(options)
{
    public DbSet<Item> Items => Set<Item>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TemplateContext).Assembly);
    }
}