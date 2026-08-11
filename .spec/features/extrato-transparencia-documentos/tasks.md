# Tasks: Extrato transparencia documentos

> feature: extrato-transparencia-documentos

## T-010 — Endpoint de Extrato Paginado com Filtros de Documentos no Backend [concluida]

- Refs: US-005, AC-010, AC-011
- Arquivos: Backend/Features/Despesas/DespesasDocumentosService.cs, Backend/Features/Despesas/DespesasDocumentosEndpoints.cs
- Notas: Endpoint GET /api/despesas/documentos criado com busca textual e paginação, verificado via TDD.

## T-011 — Componente Angular de Extrato e Busca Transparente de Documentos [concluida]

- Refs: US-005, AC-010, AC-011
- Arquivos: Frontend/src/app/core/services/despesas.service.ts, Frontend/src/app/features/extrato-documentos/extrato-documentos.ts, Frontend/src/app/features/extrato-documentos/extrato-documentos.html
- Notas: Componente Angular Material criado com busca instantânea e paginador <mat-paginator>.
