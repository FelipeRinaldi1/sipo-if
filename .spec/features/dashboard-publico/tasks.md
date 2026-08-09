# Tasks: Dashboard publico

> feature: dashboard-publico

<!--
  Como ler este arquivo (o formato é verificado por `onp-spec audit`):
  - T-xxx = tarefa (código de rastreio, único no projeto inteiro).
  - Toda tarefa referencia em `Refs:` pelo menos uma história de usuário
    (US-xxx) ou critério de aceite (AC-xxx).
  - Toda tarefa lista os arquivos que cria/altera em `Arquivos:` — capriche:
    é o que decide o que `onp-spec plano` roda em PARALELO (arquivos
    disjuntos) e o que roda em sequência.
  - Campos opcionais por tarefa, usados pelo plano de execução:
    `- Modelo: claude-sonnet-5` e `- Esforço: alto` (baixo|medio|alto|xalto|max).
  - Uma tarefa só pode virar [concluida] quando os critérios de aceite dela
    tiverem prova PASS registrada por `onp-spec verify`.
  Status: pendente | em-andamento | concluida
    (atalho: `onp-spec tarefa <feature> <T-xxx> <status>`)
-->



## T-006 — Endpoint GET /transparencia/dashboard e DTOs [concluida]
- Refs: US-003, AC-006, AC-007, AC-008, AC-010
- Arquivos: Backend/Features/Transparencia/TransparenciaEndpoints.cs, Backend/Features/Transparencia/TransparenciaContracts.cs
- Esforço: medio
- Notas: Implementar rota GET /transparencia/dashboard aceitando filtros opcionais por ano e naturezaDespesa. Retornar DTO agregando totalEmpenhado, totalLiquidado, totalPago, valorCusteio, valorCapital e percentualCusteio.

## T-007 — Serviço Angular DashboardService [concluida]
- Refs: US-003, AC-010
- Arquivos: Frontend/src/app/core/services/dashboard.service.ts
- Esforço: baixo
- Notas: Criar serviço Angular HttpClient para consumir GET /transparencia/dashboard e GET /sincronizacao/status.

## T-008 — Componente DashboardPublicoComponent (Angular Material + Tailwind Layout) [concluida]
- Refs: US-003, US-004, AC-006, AC-007, AC-008, AC-009
- Arquivos: Frontend/src/app/features/dashboard-publico/dashboard-publico.ts, Frontend/src/app/features/dashboard-publico/dashboard-publico.html, Frontend/src/app/app.routes.ts
- Esforço: alto
- Notas: Seguir estritamente P-018: Tailwind v4 APENAS para grid/flex layout (flex, grid, gap-4, p-6). Usar MatCard, MatSelect, MatIcon, MatProgressSpinner e MatTooltip do Angular Material. Exibir explicações do glossário nos tooltips do MatTooltip.

## T-009 — Testes de especificação do Dashboard Público [concluida]
- Refs: AC-006, AC-007, AC-008, AC-009, AC-010
- Arquivos: test/dashboard-publico.spec.test.js
- Esforço: medio
- Notas: Criar suíte com anotações @spec:AC-006 a @spec:AC-010 e @principle:P-018.
