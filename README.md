# SIPO-IF: Sistema Transparente de Gestão Orçamentária

O SIPO-IF é uma plataforma de transparência pública voltada para a consulta e acompanhamento da execução orçamentária do IFSP Campus Jacareí. O sistema transforma dados financeiros públicos em visualizações gráficas e tabelas analíticas para facilitar o controle social por cidadãos, alunos e gestores.

---

## Funcionalidades Principais

- **Painel de Execução Orçamentária**: Exibe indicadores chaves de desempenho financeiro, gráficos de evolução mensal dos gastos e curvas de valores acumulados.
- **Assistência Estudantil**: Apresenta a comparação entre recursos aplicados no apoio aos estudantes e no custeio operacional do campus, com seletor interativo e gráficos de linha mensais e acumulados.
- **Gestão de Fornecedores e Contratos**: Exibe o ranking dos maiores credores com base nos pagamentos efetuados.
- **Despesas por Categoria**: Exibe o gráfico de distribuição proporcional dos gastos agrupados por elemento de despesa.

---

## Arquitetura

O projeto é estruturado em monorepo com duas aplicações principais:

- **Backend**: API REST desenvolvida em .NET 10.
- **Frontend**: Aplicação web desenvolvida em Angular com a biblioteca de gráficos ApexCharts e componentes Angular Material.

---

## Execução e Desenvolvimento

### Como Rodar com Docker

1. Configurar o arquivo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Inicializar a aplicação:

   ```bash
   docker compose up --build -d
   ```

3. URLs de acesso:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000
   - Documentação da API: http://localhost:5000/scalar/v1

---

### Execução de Testes Automatizados

- Testes de Backend:

  ```bash
  dotnet test Backend/Api.Tests
  ```

- Testes de Especificação e Frontend:
  ```bash
  node --test test/*.spec.test.js
  ```

---

### Guias de Desenvolvimento

- [Guia do Backend](./Backend/README.md)
- [Guia do Frontend](./Frontend/README.md)
