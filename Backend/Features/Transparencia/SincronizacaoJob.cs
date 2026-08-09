using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Template.Data;

namespace Template.Features.Transparencia;

public class SincronizacaoJob : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<SincronizacaoJob> _logger;

    public SincronizacaoJob(IServiceProvider serviceProvider, ILogger<SincronizacaoJob> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Job de Sincronização Orçamentária iniciado.");

        while (!stoppingToken.IsCancellationRequested)
        {
            await ExecutarSincronizacaoAsync(stoppingToken);

            // Calcula o tempo até as 06:00 AM do dia seguinte
            var agora = DateTime.UtcNow;
            var proximaExecucao = agora.Date.AddDays(1).AddHours(6);
            if (agora.Hour < 6)
            {
                proximaExecucao = agora.Date.AddHours(6);
            }

            var delay = proximaExecucao - agora;
            _logger.LogInformation("Próxima sincronização agendada para: {ProximaExecucao} (UTC)", proximaExecucao);

            await Task.Delay(delay, stoppingToken);
        }
    }

    public async Task ExecutarSincronizacaoAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<TemplateContext>();
        var apiClient = scope.ServiceProvider.GetRequiredService<TransparenciaApiClient>();

        var log = new SincronizacaoLog
        {
            DataHoraUtc = DateTime.UtcNow,
            Sucesso = false,
            TotalRegistrosImportados = 0
        };

        try
        {
            int anoMaximo = Math.Min(DateTime.UtcNow.Year, 2025);
            int totalImportados = 0;

            // Busca histórico de 2020 até o ano corrente com dados
            for (int ano = 2020; ano <= anoMaximo; ano++)
            {
                var despesasApi = await apiClient.ObterDespesasPorAnoAsync(ano, cancellationToken);

                foreach (var apiDto in despesasApi)
                {
                    var empenhadoDecimal = decimal.TryParse(apiDto.Empenhado, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var emp) ? emp : 0m;
                    var liquidadoDecimal = decimal.TryParse(apiDto.Liquidado, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var liq) ? liq : 0m;
                    var pagoDecimal = decimal.TryParse(apiDto.Pago, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var pag) ? pag : 0m;

                    var numeroEmpenhoChave = $"ORGAO-{apiDto.CodigoOrgao ?? "26439"}-{ano}";

                    var despesaExistente = await dbContext.DespesasOrcamentarias
                        .FirstOrDefaultAsync(d => d.NumeroEmpenho == numeroEmpenhoChave, cancellationToken);

                    if (despesaExistente != null)
                    {
                        despesaExistente.ValorEmpenhado = empenhadoDecimal;
                        despesaExistente.ValorLiquidado = liquidadoDecimal;
                        despesaExistente.ValorPago = pagoDecimal;
                        despesaExistente.UltimaAtualizacaoUtc = DateTime.UtcNow;
                    }
                    else
                    {
                        var novaDespesa = new DespesaOrcamentaria
                        {
                            NumeroEmpenho = numeroEmpenhoChave,
                            Ano = ano,
                            Mes = 12,
                            NaturezaDespesa = "Execução Global Orçamentária",
                            Categoria = "Geral",
                            ValorEmpenhado = empenhadoDecimal,
                            ValorLiquidado = liquidadoDecimal,
                            ValorPago = pagoDecimal,
                            Favorecido = apiDto.Orgao ?? "IFSP",
                            UltimaAtualizacaoUtc = DateTime.UtcNow
                        };

                        dbContext.DespesasOrcamentarias.Add(novaDespesa);
                    }

                    totalImportados++;
                }
            }

            await dbContext.SaveChangesAsync(cancellationToken);

            log.Sucesso = true;
            log.TotalRegistrosImportados = totalImportados;
            _logger.LogInformation("Sincronização concluída com sucesso! Total de registros processados: {Total}", totalImportados);
        }
        catch (Exception ex)
        {
            log.Sucesso = false;
            log.MensagemErro = ex.Message;
            _logger.LogError(ex, "Erro durante a execução do Job de Sincronização.");
        }
        finally
        {
            dbContext.SincronizacaoLogs.Add(log);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
