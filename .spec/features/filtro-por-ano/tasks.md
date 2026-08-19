> feature: filtro-por-ano

# Tarefas — filtro-por-ano

## T-027 — Atualizar script `gerar-dados.ts` para processar múltiplos anos e gerar `anos.json` + `todos/` [concluida]

- Refs: US-018, AC-035, AC-036
- Arquivos: scripts/gerar-dados.ts
- Notas: Suporta varredura de subdiretórios em downloads/, gera subpastas por ano, pasta consolidada 'todos' e arquivo anos.json.

## T-028 — Atualizar `DespesasService` e componentes Angular com seletor de ano reativo [concluida]

- Refs: US-019, AC-037, AC-038
- Arquivos: frontend/src/app/core/services/despesas.service.ts, frontend/src/app/app.ts, frontend/src/app/app.html, frontend/src/app/features/painel-execucao/painel-execucao.ts, frontend/src/app/features/destinacao-estudantil/destinacao-estudantil.ts, frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.ts, frontend/src/app/features/categorias/categorias.ts
- Notas: Inclusão de seletor mat-select na toolbar e assinatura reativa de ano$ em todas as 4 abas do dashboard.
