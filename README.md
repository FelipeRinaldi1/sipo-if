# SIPO-IF: Sistema Transparente de Gestão Orçamentária

O **SIPO-IF** é uma plataforma de transparência pública voltada para a consulta e acompanhamento da execução orçamentária do IFSP Campus Jacareí. O sistema transforma dados financeiros públicos do Portal da Transparência em visualizações gráficas interativas e tabelas analíticas para controle social por cidadãos, alunos e gestores.

---

## Arquitetura Estática (Jamstack Full TypeScript)

O projeto opera como uma aplicação web estática sem necessidade de banco de dados ou servidor de API em produção:

- **Frontend SPA**: Desenvolvido em **Angular 22** com **Angular Material**, **ApexCharts** e **Tailwind CSS v4**. Hospedado no **GitHub Pages**.
- **Processamento de Dados**: Scripts em **TypeScript** (Node 22) para agregação dos CSVs e geração dos JSONs estáticos em `Frontend/src/assets/data/`.
- **Automação & CI/CD**: **GitHub Actions** automatiza o build e deploy estático.

---

## Funcionalidades Principais

- **Painel de Execução Orçamentária**: Exibe indicadores chaves de desempenho financeiro, gráficos de evolução mensal dos gastos e curvas de valores acumulados.
- **Assistência Estudantil**: Apresenta a comparação entre recursos aplicados no apoio aos estudantes e no custeio operacional do campus, com seletor interativo e gráficos de linha mensais e acumulados.
- **Gestão de Fornecedores e Contratos**: Exibe o ranking dos maiores credores com base nos pagamentos efetuados.
- **Despesas por Categoria**: Exibe o gráfico de distribuição proporcional dos gastos agrupados por elemento de despesa.
- **Consulta de Documentos**: Listagem com paginação e busca em tempo real na memória do cliente.

---

## Execução e Desenvolvimento Local

### Pré-requisitos
- **Node.js**: `v22.22.3` ou superior
- **npm**: `11.16.0` ou superior

### Iniciar o Projeto
Para processar os dados CSVs e abrir o frontend no navegador:

```bash
npm start
```
> O comando roda `npm run gerar-dados`, compila o Angular e abre automaticamente em `http://localhost:4200`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Processa os CSVs, inicia o servidor de desenvolvimento e abre o navegador |
| `npm run gerar-dados` | Lê os CSVs de `downloads/` e gera os JSONs em `frontend/src/assets/data/` |
| `npm run test:spec` | Executa os testes de especificação e critérios de aceite |
| `npm run build` | Compila o bundle estático de produção do Angular |
