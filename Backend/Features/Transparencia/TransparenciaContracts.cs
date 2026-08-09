namespace Template.Features.Transparencia;

public record StatusSincronizacaoDto(
    DateTime? UltimaSincronizacaoComSucessoUtc,
    int? TotalRegistrosUltimaSincronizacao,
    DateTime? UltimaFalhaUtc,
    string? MensagemUltimoErro
);
