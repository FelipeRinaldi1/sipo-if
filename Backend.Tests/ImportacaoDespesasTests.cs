using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Features.Despesas;
using Xunit;

namespace Backend.Tests;

public class ImportacaoDespesasTests
{
    private TemplateContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TemplateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new TemplateContext(options);
    }

    [Fact(DisplayName = "AC-001 — Importacao de Despesas por Orgao salva dados no banco @spec:AC-001")]
    public async Task Importacao_DespesasPorOrgao_DevePopulaTabela()
    {
        using var context = GetInMemoryContext();
        var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(tempDir);

        try
        {
            var csvContent = "\"Mês Ano\";\"Órgão Superior\";\"Órgão/Entidade Vinculada\";\"Unidade Gestora\";\"Valor Empenhado\";\"Valor Liquidado\";\"Valor Pago\";\"Valor Restos a Pagar Pagos\";\n" +
                             "\"05/2025\";\"26000 - MEC\";\"26439 - IFSP\";\"158716 - IFSP JACAREI\";\"170.940,32\";\"259.513,05\";\"334.030,29\";\"2.247,91\";\n";

            await File.WriteAllTextAsync(Path.Combine(tempDir, "despesasPorOrgao.csv"), csvContent);

            var service = new DespesasImportService(context);
            var imported = await service.ImportAllFromDirectoryAsync(tempDir);

            Assert.True(imported > 0);
            var saved = await context.DespesasPorOrgao.FirstOrDefaultAsync();
            Assert.NotNull(saved);
            Assert.Equal("05/2025", saved.MesAno);
            Assert.Equal(170940.32m, saved.ValorEmpenhado);
        }
        finally
        {
            if (Directory.Exists(tempDir)) Directory.Delete(tempDir, true);
        }
    }

    [Fact(DisplayName = "AC-002 — Importacao de Despesas por Programa Acao salva dados no banco @spec:AC-002")]
    public async Task Importacao_DespesasPorProgramaAcao_DevePopulaTabela()
    {
        using var context = GetInMemoryContext();
        var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(tempDir);

        try
        {
            var csvContent = "\"Mês Ano\";\"Programa Orçamentário\";\"Ação Orçamentária\";\"Unidade Gestora\";\"Valor Empenhado\";\"Valor Liquidado\";\"Valor Pago\";\"Valor Restos a Pagar Pagos\";\n" +
                             "\"01/2025\";\"5112 - EDUCACAO\";\"2994 - ASSISTENCIA\";\"158716 - IFSP JACAREI\";\"145.734,54\";\"98.972,00\";\"63.417,00\";\"0,00\";\n";

            await File.WriteAllTextAsync(Path.Combine(tempDir, "despesasPorProgramaAcao.csv"), csvContent);

            var service = new DespesasImportService(context);
            var imported = await service.ImportAllFromDirectoryAsync(tempDir);

            Assert.True(imported > 0);
            var saved = await context.DespesasPorProgramaAcao.FirstOrDefaultAsync();
            Assert.NotNull(saved);
            Assert.Equal("5112 - EDUCACAO", saved.ProgramaOrcamentario);
            Assert.Equal(145734.54m, saved.ValorEmpenhado);
        }
        finally
        {
            if (Directory.Exists(tempDir)) Directory.Delete(tempDir, true);
        }
    }

    [Fact(DisplayName = "AC-003 — Importacao de Extrato de Documentos salva dados no banco @spec:AC-003")]
    public async Task Importacao_DespesasDocumento_DevePopulaTabela()
    {
        using var context = GetInMemoryContext();
        var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(tempDir);

        try
        {
            var csvContent = "\"DATA\";\"DOCUMENTO\";\"LOCALIZADOR DO GASTO\";\"FASE\";\"ESPÉCIE\";\"Favorecido\";\"UF DO FAVORECIDO\";\"UG\";\"Unidade Orcamentária\";\"Órgão\";\"Órgão Superior\";\"VALOR\";\"Grupo de Despesa\";\"Elemento de Despesa\";\"Modalidade de Despesa\";\"Plano Orçamentário\";\"Autor da Emenda\";\"Função (Área de Atuação)\";\"Subfunção (Especificação da Área de Atuação)\";\"Subtítulo (Localizador)\";\"Programa de Governo\";\"Ação\"\n" +
                             "\"16/01/2025\";\"158716264392025DF800002\";\"0035\";\"Pagamento\";\"Original\";\"30.737.359/0001-07 - RAGNAR\";\"SP\";\"IFSP JACAREI\";\"INST.FED\";\"IFSP\";\"MEC\";\"4.472,91\";\"3\";\"37\";\"90\";\"0000\";\"0000\";\"12\";\"363\";\"20RL0035\";\"5112\";\"20RL\"\n";

            await File.WriteAllTextAsync(Path.Combine(tempDir, "documentos.csv"), csvContent);

            var service = new DespesasImportService(context);
            var imported = await service.ImportAllFromDirectoryAsync(tempDir);

            Assert.True(imported > 0);
            var saved = await context.DespesasDocumento.FirstOrDefaultAsync();
            Assert.NotNull(saved);
            Assert.Equal("158716264392025DF800002", saved.Documento);
            Assert.Equal(4472.91m, saved.Valor);
        }
        finally
        {
            if (Directory.Exists(tempDir)) Directory.Delete(tempDir, true);
        }
    }
}
