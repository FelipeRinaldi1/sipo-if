# Mapeamento de Tarefas: Prestação de Contas & Gestão DAA

## Tarefas de Banco e Backend (.NET 10)

- [ ] **T-022**: Criar entidade `ComunicadoDaa` (Título, DataPublicacao, Resumo, Categoria, UrlDocumento) e Migration EF Core @spec:AC-018
- [ ] **T-023**: Criar entidade `RelatorioGestaoDaa` (Ano, Titulo, TipoDocumento, UrlArquivo) @spec:AC-019
- [ ] **T-024**: Criar endpoints REST `GET /daa/comunicados` e `GET /daa/relatorios` em `DaaRelatoriosEndpoints.cs` @spec:AC-018,AC-019

## Tarefas de Teste (TDD xUnit)

- [ ] **T-025**: Escrever testes xUnit em `Backend.Tests/PrestacaoContasTests.cs` cobrindo `@spec:AC-018` e `@spec:AC-019`

## Tarefas de Frontend (Angular 22 + Material)

- [ ] **T-026**: Criar componente `PrestacaoContasDaaComponent` com timeline de comunicados e tabela de relatórios em `MatCard` @spec:AC-018,AC-019
- [ ] **T-027**: Integrar rota `/prestacao-contas-daa` no Angular Router e ativar botão no Header @spec:AC-019
