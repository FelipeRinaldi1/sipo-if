namespace Template.Features.Transparencia;

public record DashboardPublicoDto(
    int AnoSelecionado,
    decimal TotalEmpenhadoJacarei,
    decimal TotalLiquidadoJacarei,
    decimal TotalPagoJacarei,
    decimal TotalEmpenhadoGeralIfsp,
    decimal TotalLiquidadoGeralIfsp,
    decimal TotalPagoGeralIfsp,
    decimal TaxaExecucaoJacarei,
    List<int> AnosDisponiveis
);

public record StatusSincronizacaoDto(
    DateTime? UltimaSincronizacaoComSucessoUtc,
    int TotalRegistrosUltimaSincronizacao,
    DateTime? UltimaFalhaUtc,
    string? MensagemUltimoErro
);
