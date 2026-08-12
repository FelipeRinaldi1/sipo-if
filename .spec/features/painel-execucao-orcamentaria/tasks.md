# Tasks: Painel execucao orcamentaria

> feature: painel-execucao-orcamentaria

## T-004 — Endpoint de Métricas Globais e Evolução Mensal no Backend [concluida]

- Refs: US-002, AC-004, AC-005
- Arquivos: Backend/Api/Features/Despesas/DespesasDashboardService.cs, Backend/Api/Features/Despesas/DespesasDashboardEndpoints.cs
- Notas: Endpoint GET /api/despesas/resumo-execucao criado e testado via TDD.

## T-005 — Componente do Painel Executivo no Frontend Angular [concluida]

- Refs: US-002, AC-004, AC-005
- Arquivos: Frontend/src/app/core/services/despesas.service.ts, Frontend/src/app/features/painel-execucao/painel-execucao.ts, Frontend/src/app/features/painel-execucao/painel-execucao.html
- Notas: Componente Angular com cards de KPI e tabela de evolução mensal renderizados.
