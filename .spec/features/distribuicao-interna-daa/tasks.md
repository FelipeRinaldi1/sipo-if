# Mapeamento de Tarefas: Distribuição Orçamentária Interna (DAA)

## Tarefas de Banco e Backend (.NET 10)

- [ ] **T-014**: Criar entidade `ContaPublica` (Mês, Ano, Tipo: Agua/Energia, Valor, Consumo, DataVencimento) e Migration EF Core @spec:AC-015
- [ ] **T-015**: Criar entidade `AlocacaoSetorDAA` (Ano, Setor: Assistencia/Laboratorios/Ensino, ValorAprovado, ValorExecutado) @spec:AC-016
- [ ] **T-016**: Criar endpoints REST `GET /daa/utilidades` e `GET /daa/distribuicao-setores` em `DaaEndpoints.cs` @spec:AC-015,AC-016
- [ ] **T-017**: Criar endpoint REST `GET /daa/planejado-vs-executado` com filtro de exercício @spec:AC-017

## Tarefas de Teste (TDD xUnit)

- [ ] **T-018**: Escrever testes xUnit em `Backend.Tests/DaaTests.cs` cobrindo `@spec:AC-015`, `@spec:AC-016` e `@spec:AC-017`

## Tarefas de Frontend (Angular 22 + Material)

- [ ] **T-019**: Criar serviço Angular `DaaService` com RxJS HttpClient @spec:AC-015,AC-016
- [ ] **T-020**: Criar componente `DistribuiçãoInternaDaaComponent` com cartões de Água/Energia e tabela de CPO @spec:AC-015,AC-017
- [ ] **T-021**: Integrar rota `/distribuicao-daa` no Angular Router e ativar botão no Header @spec:AC-016
