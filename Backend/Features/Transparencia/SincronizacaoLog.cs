using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Template.Features.Transparencia;

[Table("SincronizacaoLogs")]
public class SincronizacaoLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateTime DataHoraUtc { get; set; } = DateTime.UtcNow;

    public bool Sucesso { get; set; }

    public int TotalRegistrosImportados { get; set; }

    [MaxLength(2000)]
    public string? MensagemErro { get; set; }
}
