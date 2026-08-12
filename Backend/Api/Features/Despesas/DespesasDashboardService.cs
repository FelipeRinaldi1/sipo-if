using Microsoft.EntityFrameworkCore;
using Api.Data;

namespace Api.Features.Despesas;

public record ResumoExecucaoDto(
    decimal TotalEmpenhado,
    decimal TotalLiquidado,
    decimal TotalPago,
    decimal TotalRestosAPagarPagos,
    List<EvolucaoMensalItemDto> EvolucaoMensal
);

public record EvolucaoMensalItemDto(
    string MesAno,
    decimal Empenhado,
    decimal Liquidado,
    decimal Pago,
    decimal RestosAPagarPagos
);

public class DespesasDashboardService(ApiContext context)
{
    public async Task<ResumoExecucaoDto> GetResumoExecucaoAsync()
    {
        var registros = await context.DespesasPorOrgao.ToListAsync();

        var totalEmpenhado = registros.Sum(r => r.ValorEmpenhado);
        var totalLiquidado = registros.Sum(r => r.ValorLiquidado);
        var totalPago = registros.Sum(r => r.ValorPago);
        var totalRestosAPagarPagos = registros.Sum(r => r.ValorRestosAPagarPagos);

        var evolucaoMensal = registros
            .GroupBy(r => r.MesAno)
            .Select(g => new EvolucaoMensalItemDto(
                MesAno: g.Key,
                Empenhado: g.Sum(x => x.ValorEmpenhado),
                Liquidado: g.Sum(x => x.ValorLiquidado),
                Pago: g.Sum(x => x.ValorPago),
                RestosAPagarPagos: g.Sum(x => x.ValorRestosAPagarPagos)
            ))
            .OrderBy(e => ParseMesAnoSortKey(e.MesAno))
            .ToList();

        return new ResumoExecucaoDto(
            totalEmpenhado,
            totalLiquidado,
            totalPago,
            totalRestosAPagarPagos,
            evolucaoMensal
        );
    }

    private static int ParseMesAnoSortKey(string mesAno)
    {
        // Ex: "01/2025" -> 202501
        var parts = mesAno.Split('/');
        if (parts.Length == 2 && int.TryParse(parts[0], out var m) && int.TryParse(parts[1], out var y))
        {
            return y * 100 + m;
        }
        return 0;
    }
}
