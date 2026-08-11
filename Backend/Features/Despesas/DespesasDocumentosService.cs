using Microsoft.EntityFrameworkCore;
using Template.Data;

namespace Template.Features.Despesas;

public record ResultadoPaginadoDocumentosDto(
    int Pagina,
    int TamanhoPagina,
    int TotalRegistros,
    int TotalPaginas,
    List<DespesaDocumentoDto> Itens
);

public record DespesaDocumentoDto(
    Guid Id,
    DateTime Data,
    string Documento,
    string LocalizadorGasto,
    string Fase,
    string Especie,
    string Favorecido,
    decimal Valor,
    string GrupoDespesa,
    string ElementoDespesa
);

public class DespesasDocumentosService(TemplateContext context)
{
    public async Task<ResultadoPaginadoDocumentosDto> GetDocumentosPaginadoAsync(string? busca, int pagina = 1, int tamanhoPagina = 10)
    {
        if (pagina < 1) pagina = 1;
        if (tamanhoPagina < 1) tamanhoPagina = 10;
        if (tamanhoPagina > 100) tamanhoPagina = 100;

        IQueryable<DespesaDocumento> query = context.DespesasDocumento.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(busca))
        {
            var termo = busca.Trim().ToLower();
            query = query.Where(d =>
                EF.Functions.Like(d.Documento.ToLower(), $"%{termo}%") ||
                EF.Functions.Like(d.Favorecido.ToLower(), $"%{termo}%") ||
                EF.Functions.Like(d.LocalizadorGasto.ToLower(), $"%{termo}%") ||
                EF.Functions.Like(d.ElementoDespesa.ToLower(), $"%{termo}%")
            );
        }

        var totalRegistros = await query.CountAsync();
        var totalPaginas = (int)Math.Ceiling(totalRegistros / (double)tamanhoPagina);

        var itens = await query
            .OrderByDescending(d => d.Data)
            .ThenByDescending(d => d.Valor)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .Select(d => new DespesaDocumentoDto(
                d.Id,
                d.Data,
                d.Documento,
                d.LocalizadorGasto,
                d.Fase,
                d.Especie,
                d.Favorecido,
                d.Valor,
                d.GrupoDespesa,
                d.ElementoDespesa
            ))
            .ToListAsync();

        return new ResultadoPaginadoDocumentosDto(
            pagina,
            tamanhoPagina,
            totalRegistros,
            totalPaginas,
            itens
        );
    }
}
