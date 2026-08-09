using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Template.Features.Transparencia;

[Table("DespesasOrcamentarias")]
[Index(nameof(NumeroEmpenho), IsUnique = true)]
public class DespesaOrcamentaria
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(50)]
    public required string NumeroEmpenho { get; set; }

    public int Ano { get; set; }
    
    public int Mes { get; set; }

    [MaxLength(200)]
    public required string NaturezaDespesa { get; set; }

    [MaxLength(50)]
    public required string Categoria { get; set; } // Custeio vs Capital

    [Precision(18, 2)]
    public decimal ValorEmpenhado { get; set; }

    [Precision(18, 2)]
    public decimal ValorLiquidado { get; set; }

    [Precision(18, 2)]
    public decimal ValorPago { get; set; }

    [MaxLength(500)]
    public string? Favorecido { get; set; }

    public DateTime UltimaAtualizacaoUtc { get; set; } = DateTime.UtcNow;
}
