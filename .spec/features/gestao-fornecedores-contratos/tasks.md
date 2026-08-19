# Tasks: Gestao fornecedores contratos

> feature: gestao-fornecedores-contratos

## T-008 — Endpoint de Fornecedores e Elementos de Despesa no Backend [concluida]

- Refs: US-004, AC-008, AC-009
- Arquivos: Backend/Api/Features/Despesas/DespesasFornecedoresService.cs, Backend/Api/Features/Despesas/DespesasFornecedoresEndpoints.cs
- Notas: Endpoint GET /api/despesas/fornecedores criado e verificado via TDD.

## T-009 — Componente Angular de Gestão de Fornecedores e Contratos [concluida]

- Refs: US-004, AC-008, AC-009
- Arquivos: Frontend/src/app/core/services/despesas.service.ts, Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.ts, Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.html
- Notas: Componente Angular Material criado com Ranking Top 10 e Agrupamento por Elemento de Despesa.

## T-010 — Gráfico de Linha/Área Selecionável por Fornecedor com Autocomplete [concluida]

- Refs: US-004, AC-039, AC-040
- Arquivos: scripts/aggregators/fornecedores.ts, scripts/types.ts, Frontend/src/app/core/services/despesas.service.ts, Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.ts, Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.html, Frontend/test/gestao-fornecedores-evolucao.spec.test.ts
- Notas: Agregação temporal por credor e mês implementada com gráfico selecionável de linha/área e barra de pesquisa com autocomplete.

## T-011 — Treemap de Concentração Orçamentária e Simplificação do Painel [concluida]

- Refs: US-004, AC-041
- Arquivos: Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.ts, Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.html, Frontend/test/gestao-fornecedores-evolucao.spec.test.ts
- Notas: Implementado Treemap com top 12 fornecedores e agrupamento de demais fornecedores; remoção de Pareto, Top 5 em barras e card de ordens/lançamentos.
