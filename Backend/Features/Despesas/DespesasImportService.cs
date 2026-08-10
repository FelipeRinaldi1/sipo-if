using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Template.Data;

namespace Template.Features.Despesas;

public class DespesasImportService(TemplateContext context)
{
    private static readonly CultureInfo PtBrCulture = new CultureInfo("pt-BR");

    public async Task<int> ImportAllFromDirectoryAsync(string uploadsDirectory)
    {
        int totalImported = 0;

        // Q-001 Resolution: Clear existing records before importing
        context.DespesasPorOrgao.RemoveRange(context.DespesasPorOrgao);
        context.DespesasPorProgramaAcao.RemoveRange(context.DespesasPorProgramaAcao);
        context.DespesasDocumento.RemoveRange(context.DespesasDocumento);
        await context.SaveChangesAsync();

        var orgaoFile = Path.Combine(uploadsDirectory, "despesasPorOrgao.csv");
        if (File.Exists(orgaoFile))
        {
            var records = await ParseDespesasPorOrgaoAsync(orgaoFile);
            await context.DespesasPorOrgao.AddRangeAsync(records);
            totalImported += records.Count;
        }

        var programaFile = Path.Combine(uploadsDirectory, "despesasPorProgramaAcao.csv");
        if (File.Exists(programaFile))
        {
            var records = await ParseDespesasPorProgramaAcaoAsync(programaFile);
            await context.DespesasPorProgramaAcao.AddRangeAsync(records);
            totalImported += records.Count;
        }

        var documentosFile = Path.Combine(uploadsDirectory, "documentos.csv");
        if (File.Exists(documentosFile))
        {
            var records = await ParseDespesasDocumentoAsync(documentosFile);
            await context.DespesasDocumento.AddRangeAsync(records);
            totalImported += records.Count;
        }

        await context.SaveChangesAsync();
        return totalImported;
    }

    private static async Task<List<DespesaPorOrgao>> ParseDespesasPorOrgaoAsync(string filePath)
    {
        var lines = await File.ReadAllLinesAsync(filePath);
        var result = new List<DespesaPorOrgao>();

        for (int i = 1; i < lines.Length; i++)
        {
            var line = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(line)) continue;

            var cols = CleanCols(line.Split(';'));
            if (cols.Length < 8) continue;

            result.Add(new DespesaPorOrgao
            {
                MesAno = cols[0],
                OrgaoSuperior = cols[1],
                OrgaoEntidadeVinculada = cols[2],
                UnidadeGestora = cols[3],
                ValorEmpenhado = ParseDecimal(cols[4]),
                ValorLiquidado = ParseDecimal(cols[5]),
                ValorPago = ParseDecimal(cols[6]),
                ValorRestosAPagarPagos = ParseDecimal(cols[7])
            });
        }
        return result;
    }

    private static async Task<List<DespesaPorProgramaAcao>> ParseDespesasPorProgramaAcaoAsync(string filePath)
    {
        var lines = await File.ReadAllLinesAsync(filePath);
        var result = new List<DespesaPorProgramaAcao>();

        for (int i = 1; i < lines.Length; i++)
        {
            var line = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(line)) continue;

            var cols = CleanCols(line.Split(';'));
            if (cols.Length < 7) continue;

            result.Add(new DespesaPorProgramaAcao
            {
                MesAno = cols[0],
                ProgramaOrcamentario = cols[1],
                AcaoOrcamentaria = cols[2],
                UnidadeGestora = cols[3],
                ValorEmpenhado = ParseDecimal(cols[4]),
                ValorLiquidado = ParseDecimal(cols[5]),
                ValorPago = ParseDecimal(cols[6]),
                ValorRestosAPagarPagos = cols.Length > 7 ? ParseDecimal(cols[7]) : 0m
            });
        }
        return result;
    }

    private static async Task<List<DespesaDocumento>> ParseDespesasDocumentoAsync(string filePath)
    {
        var lines = await File.ReadAllLinesAsync(filePath);
        var result = new List<DespesaDocumento>();

        for (int i = 1; i < lines.Length; i++)
        {
            var line = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(line)) continue;

            var cols = CleanCols(line.Split(';'));
            if (cols.Length < 22) continue;

            result.Add(new DespesaDocumento
            {
                Data = ParseDate(cols[0]),
                Documento = cols[1],
                LocalizadorGasto = cols[2],
                Fase = cols[3],
                Especie = cols[4],
                Favorecido = cols[5],
                UfFavorecido = cols[6],
                Ug = cols[7],
                UnidadeOrcamentaria = cols[8],
                Orgao = cols[9],
                OrgaoSuperior = cols[10],
                Valor = ParseDecimal(cols[11]),
                GrupoDespesa = cols[12],
                ElementoDespesa = cols[13],
                ModalidadeDespesa = cols[14],
                PlanoOrcamentario = cols[15],
                AutorEmenda = cols[16],
                Funcao = cols[17],
                Subfuncao = cols[18],
                Subtitulo = cols[19],
                ProgramaGoverno = cols[20],
                Acao = cols[21]
            });
        }
        return result;
    }

    private static string[] CleanCols(string[] rawCols)
    {
        return rawCols.Select(c => c.Trim('"', ' ', '\t')).ToArray();
    }

    private static decimal ParseDecimal(string rawVal)
    {
        if (string.IsNullOrWhiteSpace(rawVal)) return 0m;
        if (decimal.TryParse(rawVal, NumberStyles.Any, PtBrCulture, out var val))
        {
            return val;
        }
        return 0m;
    }

    private static DateTime ParseDate(string rawVal)
    {
        if (DateTime.TryParseExact(rawVal, "dd/MM/yyyy", PtBrCulture, DateTimeStyles.None, out var dt))
        {
            return DateTime.SpecifyKind(dt, DateTimeKind.Utc);
        }
        return DateTime.SpecifyKind(DateTime.MinValue, DateTimeKind.Utc);
    }
}
