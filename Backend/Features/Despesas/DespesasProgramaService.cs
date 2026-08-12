using Microsoft.EntityFrameworkCore;
using Template.Data;

namespace Template.Features.Despesas;

public record ResumoProgramaAcaoDto(
    decimal TotalGeralEmpenhado,
    decimal TotalGeralPago,
    List<ItemAcaoResumoDto> Acoes,
    List<EvolucaoAcaoItemDto> EvolucaoAssistenciaMensal
);

public record ItemAcaoResumoDto(
    string CodigoAcao,
    string NomeAcao,
    decimal TotalEmpenhado,
    decimal TotalLiquidado,
    decimal TotalPago,
    double PorcentagemDoTotal
);

public record EvolucaoAcaoItemDto(
    string CodigoAcao,
    string MesAno,
    decimal ValorEmpenhado,
    decimal ValorLiquidado,
    decimal ValorPago
);

public class DespesasProgramaService(TemplateContext context)
{
    public async Task<ResumoProgramaAcaoDto> GetResumoProgramaAcaoAsync()
    {
        var registros = await context.DespesasPorProgramaAcao.ToListAsync();

        var totalEmpenhado = registros.Sum(r => r.ValorEmpenhado);
        var totalPago = registros.Sum(r => r.ValorPago);

        var acoesAgrupadas = registros
            .GroupBy(r => ExtrairCodigoAcao(r.AcaoOrcamentaria))
            .Select(g =>
            {
                var cod = g.Key;
                var primeiroNome = g.First().AcaoOrcamentaria;
                var emp = g.Sum(x => x.ValorEmpenhado);
                var liq = g.Sum(x => x.ValorLiquidado);
                var pag = g.Sum(x => x.ValorPago);
                var pct = totalPago > 0 ? (double)Math.Round((pag / totalPago) * 100, 2) : 0;

                return new ItemAcaoResumoDto(
                    CodigoAcao: cod,
                    NomeAcao: primeiroNome,
                    TotalEmpenhado: emp,
                    TotalLiquidado: liq,
                    TotalPago: pag,
                    PorcentagemDoTotal: pct
                );
            })
            .OrderByDescending(a => a.TotalPago)
            .ToList();

        var evolucaoAcoes = registros
            .Select(r => new { CodigoAcao = ExtrairCodigoAcao(r.AcaoOrcamentaria), r.MesAno, r.ValorEmpenhado, r.ValorLiquidado, r.ValorPago })
            .GroupBy(r => new { r.CodigoAcao, r.MesAno })
            .Select(g => new EvolucaoAcaoItemDto(
                CodigoAcao: g.Key.CodigoAcao,
                MesAno: g.Key.MesAno,
                ValorEmpenhado: g.Sum(x => x.ValorEmpenhado),
                ValorLiquidado: g.Sum(x => x.ValorLiquidado),
                ValorPago: g.Sum(x => x.ValorPago)
            ))
            .OrderBy(e => ParseMesAnoSortKey(e.MesAno))
            .ToList();

        return new ResumoProgramaAcaoDto(
            totalEmpenhado,
            totalPago,
            acoesAgrupadas,
            evolucaoAcoes
        );
    }

    private static string ExtrairCodigoAcao(string rawAcao)
    {
        if (string.IsNullOrWhiteSpace(rawAcao)) return "OUTRAS";
        var parts = rawAcao.Split('-');
        if (parts.Length > 0)
        {
            return parts[0].Trim();
        }
        return rawAcao.Trim();
    }

    private static int ParseMesAnoSortKey(string mesAno)
    {
        var parts = mesAno.Split('/');
        if (parts.Length == 2 && int.TryParse(parts[0], out var m) && int.TryParse(parts[1], out var y))
        {
            return y * 100 + m;
        }
        return 0;
    }
}
