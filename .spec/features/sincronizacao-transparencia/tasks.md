# Tasks: Sincronizacao transparencia

> feature: sincronizacao-transparencia

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

## T-001 — Entidade DespesaOrcamentaria e migration [concluida]
- Refs: US-001, AC-001, AC-002
- Arquivos: Backend/Features/Transparencia/DespesaOrcamentaria.cs, Backend/Data/TemplateContext.cs, Backend/Data/Migrations
- Esforço: medio
- Notas: Criar entidade com campos empenhado/liquidado/pago/natureza/ano/mes/numeroEmpenho. Campo numeroEmpenho é chave de negócio para upsert (unico no banco). Adicionar DbSet ao contexto e rodar migration.

## T-002 — Cliente HTTP para API do Portal da Transparência [concluida]
- Refs: US-001, AC-001, AC-003
- Arquivos: Backend/Features/Transparencia/TransparenciaApiClient.cs, Backend/Extensions/BuilderExtensions.cs
- Esforço: medio
- Notas: Usar HttpClient com typed client. URL base: https://api.portaldatransparencia.gov.br/api-de-dados. Filtrar por UG 158716. Usar o header `chave-api-dados` lendo de `PORTAL_TRANSPARENCIA_API_KEY`. Suportar consulta por ano (desde 2020 até o ano atual). Tratar timeout e erros HTTP sem lançar exceção não tratada.

## T-003 — Job de sincronização agendada (IHostedService) [concluida]
- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: Backend/Features/Transparencia/SincronizacaoJob.cs, Backend/Features/Transparencia/SincronizacaoLog.cs, Backend/Extensions/BuilderExtensions.cs
- Esforço: alto
- Notas: Depende de T-001 e T-002. Implementar job diário com execução calculada para as 06:00 AM (ou ao iniciar o app caso nunca tenha sido executado). Realizar o loop de 2020 até o ano atual. Implementar upsert por numeroEmpenho. Registrar SincronizacaoLog a cada tentativa.

## T-004 — Endpoint GET /sincronizacao/status [concluida]
- Refs: US-002, AC-004, AC-005
- Arquivos: Backend/Features/Transparencia/TransparenciaEndpoints.cs, Backend/Features/Transparencia/TransparenciaContracts.cs, Backend/Features/Transparencia/transparencia.http, Backend/Extensions/AppExtensions.cs
- Esforço: baixo
- Notas: Depende de T-003 (tabela SincronizacaoLog deve existir). Retornar última sincronização bem-sucedida e última falha (se houver). Rota pública (sem RequireAuthorization) por ora.

## T-005 — Testes de integração da sincronização [concluida]
- Refs: AC-001, AC-002, AC-003, AC-004, AC-005
- Arquivos: test/sincronizacao-transparencia.spec.test.js
- Esforço: alto
- Notas: Depende de T-003 e T-004. Mockar HttpClient para simular resposta da API e simular falha. Verificar upsert (sem duplicatas), persistência e log. Anotar cada teste com @spec:AC-xxx correspondente.
