using Microsoft.EntityFrameworkCore;
using Template.Data;

namespace Template.Features.Despesas;

public record ResumoFornecedoresDto(
    decimal TotalGeral,
    List<TopFornecedorItemDto> TopFornecedores,
    List<ElementoDespesaItemDto> ElementosDespesa
);

public record TopFornecedorItemDto(
    string Favorecido,
    decimal TotalPago,
    int QuantidadeLancamentos,
    double PorcentagemDoTotal
);

public record ElementoDespesaItemDto(
    string Elemento,
    decimal TotalPago,
    int QuantidadeLancamentos,
    double PorcentagemDoTotal
);

public class DespesasFornecedoresService(TemplateContext context)
{
    public async Task<ResumoFornecedoresDto> GetResumoFornecedoresAsync()
    {
        var documentos = await context.DespesasDocumento.ToListAsync();

        var totalGeral = documentos.Sum(d => d.Valor);

        var topFornecedores = documentos
            .Where(d => !string.IsNullOrWhiteSpace(d.Favorecido))
            .GroupBy(d => d.Favorecido)
            .Select(g =>
            {
                var total = g.Sum(x => x.Valor);
                var pct = totalGeral > 0 ? (double)Math.Round((total / totalGeral) * 100, 2) : 0;
                return new TopFornecedorItemDto(
                    Favorecido: g.Key,
                    TotalPago: total,
                    QuantidadeLancamentos: g.Count(),
                    PorcentagemDoTotal: pct
                );
            })
            .OrderByDescending(f => f.TotalPago)
            .Take(10)
            .ToList();

        var elementosDespesa = documentos
            .Where(d => !string.IsNullOrWhiteSpace(d.ElementoDespesa))
            .GroupBy(d => d.ElementoDespesa)
            .Select(g =>
            {
                var total = g.Sum(x => x.Valor);
                var pct = totalGeral > 0 ? (double)Math.Round((total / totalGeral) * 100, 2) : 0;
                return new ElementoDespesaItemDto(
                    Elemento: g.Key,
                    TotalPago: total,
                    QuantidadeLancamentos: g.Count(),
                    PorcentagemDoTotal: pct
                );
            })
            .OrderByDescending(e => e.TotalPago)
            .ToList();

        return new ResumoFornecedoresDto(
            totalGeral,
            topFornecedores,
            elementosDespesa
        );
    }
}
