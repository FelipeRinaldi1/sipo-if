# Tasks: Importacao despesas csv

> feature: importacao-despesas-csv

## T-000 — Infraestrutura base do projeto (boilerplate) [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend/Api/Program.cs, Backend/Api/Data/DataExtensions.cs, Backend/Api/Data/Migrations/20260808011704_InitialCreate.cs, Backend/Api/Data/Migrations/20260808011704_InitialCreate.Designer.cs, Backend/Api/Data/Migrations/ApiContextModelSnapshot.cs, Backend/Api/Extensions/AppExtensions.cs, Backend/Api/Extensions/BuilderExtensions.cs, Backend/Api/Extensions/ValidationExtensions.cs, Backend/Api/Features/Items/Item.cs, Backend/Api/Features/Items/ItemContracts.cs, Backend/Api/Features/Items/ItemEndpoints.cs, Backend/Api/Features/Users/User.cs, Backend/Api/Features/Users/UserContracts.cs, Backend/Api/Features/Users/UserEndpoints.cs, Backend/Api/Features/Users/UserMapper.cs, Backend/Api/Features/Users/CustomClaimsPrincipalFactory.cs, Frontend/src/index.html, Frontend/src/main.ts, Frontend/src/styles.scss, Frontend/src/app/app.config.ts, Frontend/src/app/app.routes.ts, Frontend/src/app/app.scss, Frontend/src/app/app.html, Frontend/src/app/app.ts
- Notas: Arquivos de infraestrutura e boilerplate do template base. O arquivo .NETCoreApp é gerado automaticamente pelo dotnet build.

## T-001 — Mapear Entidades EF Core das 3 Tabelas [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend/Api/Features/Despesas/DespesaPorOrgao.cs, Backend/Api/Features/Despesas/DespesaPorProgramaAcao.cs, Backend/Api/Features/Despesas/DespesaDocumento.cs, Backend/Api/Data/ApiContext.cs
- Notas: Entidades criadas e mapeadas no DbContext.

## T-002 — Criar Serviço de Ingestão e Parser CSV no Backend [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend/Api/Features/Despesas/DespesasImportService.cs
- Notas: Serviço de ingestão com conversão de tipos de dados implementado.

## T-003 — Testes Unitários de Importação dos CSVs [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend/Api.Tests/ImportacaoDespesasTests.cs
- Notas: Testes anotados com @spec:AC-001, @spec:AC-002, @spec:AC-003 criados e aprovados.
