# Tasks: Importacao despesas csv

> feature: importacao-despesas-csv

## T-000 — Infraestrutura base do projeto (boilerplate) [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend/Program.cs, Backend/Data/DataExtensions.cs, Backend/Data/Migrations/20260808011704_InitialCreate.cs, Backend/Data/Migrations/20260808011704_InitialCreate.Designer.cs, Backend/Data/Migrations/TemplateContextModelSnapshot.cs, Backend/Extensions/AppExtensions.cs, Backend/Extensions/BuilderExtensions.cs, Backend/Extensions/ValidationExtensions.cs, Backend/Features/Items/Item.cs, Backend/Features/Items/ItemContracts.cs, Backend/Features/Items/ItemEndpoints.cs, Backend/Features/Users/User.cs, Backend/Features/Users/UserContracts.cs, Backend/Features/Users/UserEndpoints.cs, Backend/Features/Users/UserMapper.cs, Backend/Features/Users/CustomClaimsPrincipalFactory.cs, Backend/obj/Debug/net10.0/Template.AssemblyInfo.cs, Backend/obj/Debug/net10.0/Template.GlobalUsings.g.cs, Backend/obj/Debug/net10.0/Template.MvcApplicationPartsAssemblyInfo.cs, Frontend/src/index.html, Frontend/src/main.ts, Frontend/src/styles.scss, Frontend/src/app/app.config.ts, Frontend/src/app/app.routes.ts, Frontend/src/app/app.scss, Frontend/src/app/app.html, Frontend/src/app/app.ts
- Notas: Arquivos de infraestrutura e boilerplate do template base. O arquivo .NETCoreApp é gerado automaticamente pelo dotnet build.

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
