# Tasks: Importacao despesas csv

> feature: importacao-despesas-csv

## T-001 — Mapear Entidades EF Core das 3 Tabelas [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend/Features/Despesas/DespesaPorOrgao.cs, Backend/Features/Despesas/DespesaPorProgramaAcao.cs, Backend/Features/Despesas/DespesaDocumento.cs, Backend/Data/TemplateContext.cs
- Notas: Entidades criadas e mapeadas no DbContext.

## T-002 — Criar Serviço de Ingestão e Parser CSV no Backend [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend/Features/Despesas/DespesasImportService.cs
- Notas: Serviço de ingestão com conversão de tipos de dados implementado.

## T-003 — Testes Unitários de Importação dos CSVs [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend.Tests/ImportacaoDespesasTests.cs
- Notas: Testes anotados com @spec:AC-001, @spec:AC-002, @spec:AC-003 criados e aprovados.
