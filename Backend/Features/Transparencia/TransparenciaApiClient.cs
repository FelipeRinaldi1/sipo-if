using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Template.Features.Transparencia;

public record TransparenciaDespesaApiResponse(
    [property: JsonPropertyName("ano")] int Ano,
    [property: JsonPropertyName("orgao")] string? Orgao,
    [property: JsonPropertyName("codigoOrgao")] string? CodigoOrgao,
    [property: JsonPropertyName("empenhado")] string? Empenhado,
    [property: JsonPropertyName("liquidado")] string? Liquidado,
    [property: JsonPropertyName("pago")] string? Pago
);

public class TransparenciaApiClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TransparenciaApiClient> _logger;
    private readonly string _ugCampus;

    public TransparenciaApiClient(HttpClient httpClient, IConfiguration configuration, ILogger<TransparenciaApiClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _ugCampus = configuration["UG_CAMPUS"] ?? "158716";

        var apiKey = configuration["PORTAL_TRANSPARENCIA_API_KEY"] 
            ?? configuration["PORTAL_TRANSPARENCIA_KEY"]
            ?? Environment.GetEnvironmentVariable("PORTAL_TRANSPARENCIA_API_KEY")
            ?? Environment.GetEnvironmentVariable("PORTAL_TRANSPARENCIA_KEY");

        _httpClient.BaseAddress = new Uri("https://api.portaldatransparencia.gov.br/api-de-dados/");
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            _httpClient.DefaultRequestHeaders.Add("chave-api-dados", apiKey.Trim());
            _logger.LogInformation("Chave de API do Portal da Transparência configurada com sucesso.");
        }
        else
        {
            _logger.LogWarning("Nenhuma chave de API do Portal da Transparência foi encontrada no .env ou configuração!");
        }
    }

    public async Task<List<TransparenciaDespesaApiResponse>> ObterDespesasPorAnoAsync(int ano, CancellationToken cancellationToken = default)
    {
        try
        {
            var despesasResultado = new List<TransparenciaDespesaApiResponse>();

            // Endpoint oficial do Portal da Transparência: despesas/por-orgao
            var endpoint = $"despesas/por-orgao?ano={ano}&orgao=26439&pagina=1";

            var response = await _httpClient.GetAsync(endpoint, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Consulta API Portal da Transparência ({Ano}). Status: {StatusCode}", ano, response.StatusCode);
                return despesasResultado;
            }

            var despesas = await response.Content.ReadFromJsonAsync<List<TransparenciaDespesaApiResponse>>(cancellationToken: cancellationToken);
            return despesas ?? despesasResultado;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro de conexão ao acessar a API do Portal da Transparência para o ano {Ano}", ano);
            return new List<TransparenciaDespesaApiResponse>();
        }
    }
}
