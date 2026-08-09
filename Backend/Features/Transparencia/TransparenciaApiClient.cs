namespace Template.Features.Transparencia;

using System.Text.Json;
using System.Text.Json.Serialization;

public class TransparenciaApiClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TransparenciaApiClient> _logger;

    public TransparenciaApiClient(HttpClient httpClient, IConfiguration configuration, ILogger<TransparenciaApiClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        var apiKey = configuration["PORTAL_TRANSPARENCIA_KEY"] 
                  ?? configuration["PORTAL_TRANSPARENCIA_API_KEY"] 
                  ?? Environment.GetEnvironmentVariable("PORTAL_TRANSPARENCIA_KEY")
                  ?? Environment.GetEnvironmentVariable("PORTAL_TRANSPARENCIA_API_KEY");

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("Chave da API do Portal da Transparência não configurada.");
        }
        else
        {
            _httpClient.DefaultRequestHeaders.Remove("chave-api-dados");
            _httpClient.DefaultRequestHeaders.Add("chave-api-dados", apiKey);
            _logger.LogInformation("Chave de API do Portal da Transparência configurada com sucesso.");
        }

        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        _httpClient.DefaultRequestHeaders.Accept.ParseAdd("application/json");
    }

    // 1. Totais Globais via /despesas/por-orgao
    public async Task<List<DespesaPorOrgaoGovDto>> ObterDespesasPorAnoAsync(int ano, CancellationToken cancellationToken = default)
    {
        try
        {
            var url = $"https://api.portaldatransparencia.gov.br/api-de-dados/despesas/por-orgao?ano={ano}&orgao=26439&pagina=1";
            var response = await _httpClient.GetAsync(url, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Consulta API Portal da Transparência /por-orgao ({Ano}). Status: {Status}", ano, response.StatusCode);
                return new List<DespesaPorOrgaoGovDto>();
            }

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            var result = JsonSerializer.Deserialize<List<DespesaPorOrgaoGovDto>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new List<DespesaPorOrgaoGovDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao consultar API do Portal da Transparência para o ano {Ano}.", ano);
            return new List<DespesaPorOrgaoGovDto>();
        }
    }

    // 2. Favorecidos e Empresas REAIS do Campus Jacareí via /despesas/recursos-recebidos (unidadeGestora=158716)
    public async Task<List<RecursoRecebidoGovDto>> ObterRecursosRecebidosPorAnoAsync(int ano, CancellationToken cancellationToken = default)
    {
        try
        {
            var mesInicio = $"01/{ano}";
            var mesFim = $"12/{ano}";
            var url = $"https://api.portaldatransparencia.gov.br/api-de-dados/despesas/recursos-recebidos?mesAnoInicio={mesInicio}&mesAnoFim={mesFim}&orgao=26439&pagina=1";
            
            var response = await _httpClient.GetAsync(url, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Consulta API /recursos-recebidos orgao 26439 ({Ano}). Status: {Status}", ano, response.StatusCode);
                return new List<RecursoRecebidoGovDto>();
            }

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            var result = JsonSerializer.Deserialize<List<RecursoRecebidoGovDto>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new List<RecursoRecebidoGovDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao consultar recursos-recebidos UG 158716 para o ano {Ano}.", ano);
            return new List<RecursoRecebidoGovDto>();
        }
    }
}

public class DespesaPorOrgaoGovDto
{
    public int Ano { get; set; }
    public string? Orgao { get; set; }
    public string? CodigoOrgao { get; set; }
    public string? OrgaoSuperior { get; set; }
    public string? CodigoOrgaoSuperior { get; set; }
    public string? Empenhado { get; set; }
    public string? Liquidado { get; set; }
    public string? Pago { get; set; }
}

public class RecursoRecebidoGovDto
{
    public int AnoMes { get; set; }
    public string? CodigoPessoa { get; set; }
    public string? NomePessoa { get; set; }
    public string? TipoPessoa { get; set; }
    public string? MunicipioPessoa { get; set; }
    public string? SiglaUFPessoa { get; set; }
    public string? CodigoUG { get; set; }
    public string? NomeUG { get; set; }
    public string? CodigoOrgao { get; set; }
    public string? NomeOrgao { get; set; }
    public decimal Valor { get; set; }
}
