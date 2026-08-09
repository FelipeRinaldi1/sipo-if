namespace Template.Features.Transparencia;

using System.Text.Json;
using System.Text.Json.Serialization;

public class DadosAbertosIfspClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<DadosAbertosIfspClient> _logger;

    public DadosAbertosIfspClient(HttpClient httpClient, ILogger<DadosAbertosIfspClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        _httpClient.DefaultRequestHeaders.Accept.ParseAdd("application/json");
    }

    public async Task<List<CkanRecordDto>> ObterOrcamentoJacareiAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var resourceId = "eb9639a0-58bb-47d5-b215-606bb459446a";
            var url = $"https://dados.ifsp.edu.br/api/3/action/datastore_search?resource_id={resourceId}&q=Jacare%C3%AD";

            var response = await _httpClient.GetAsync(url, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Falha ao consultar API CKAN Dados Abertos IFSP. Status: {Status}", response.StatusCode);
                return new List<CkanRecordDto>();
            }

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            var responseDto = JsonSerializer.Deserialize<CkanResponseDto>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return responseDto?.Result?.Records ?? new List<CkanRecordDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao consultar API do CKAN de Dados Abertos do IFSP.");
            return new List<CkanRecordDto>();
        }
    }
}

public class CkanResponseDto
{
    public bool Success { get; set; }
    public CkanResultDto? Result { get; set; }
}

public class CkanResultDto
{
    public List<CkanRecordDto> Records { get; set; } = new();
}

public class CkanRecordDto
{
    [JsonPropertyName("_id")]
    public int Id { get; set; }

    public string? Campus { get; set; }
    
    [JsonPropertyName("UG Executora")]
    public string? UgExecutora { get; set; }

    public object? Ano { get; set; }
    public object? Valor { get; set; }
}
