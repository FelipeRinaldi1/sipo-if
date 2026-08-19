> feature: site-estatico-github-pages

# Tarefas — site-estatico-github-pages

## T-023 — Criar scripts TypeScript de agregação dos CSVs e geração de JSONs [concluida]
- Status: pendente
- Refs: US-014, AC-023, AC-024, AC-025, AC-026
- Arquivos: scripts/gerar-dados.ts, scripts/aggregators/dashboard.ts, scripts/aggregators/programa-acao.ts, scripts/aggregators/fornecedores.ts, scripts/aggregators/documentos.ts, scripts/types.ts
- Esforço: médio

## T-024 — Alterar `DespesasService` Angular para ler JSONs locais [concluida]
- Status: pendente
- Refs: US-015, AC-027, AC-028, AC-029
- Arquivos: Frontend/src/app/core/services/despesas.service.ts, Frontend/src/environments/environment.ts, Frontend/src/environments/environment.development.ts
- Esforço: baixo

## T-025 — Criar workflow GitHub Actions com deploy no GitHub Pages [concluida]
- Status: pendente
- Refs: US-016, AC-030, AC-031, AC-032
- Arquivos: .github/workflows/atualizar-dados.yml
- Esforço: baixo

## T-026 — Criar script Playwright em TypeScript de download dos CSVs [concluida]
- Status: pendente
- Refs: US-017, AC-033, AC-034
- Arquivos: scripts/baixar-csvs.ts, scripts/package.json
- Esforço: médio
