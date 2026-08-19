> feature: filtro-por-ano
> status: implementada

# Filtro por Ano no Dashboard Orçamentário

## Contexto

O SIPO-IF permite visualizar dados orçamentários do IFSP. Atualmente o dashboard exibe apenas dados fixos de um exercício. Esta feature implementa a capacidade de filtrar as visualizações e gráficos por ano (ex: 2025, 2026, etc.) e também selecionar a opção consolidada **"Todos os anos"**, permitindo comparar séries temporais históricas ou focar em um exercício específico.

## Histórias de usuário

### US-018 — Script gera dados particionados por ano e consolidados ("todos")

**Como** mantenedor do SIPO-IF,
**quero** que `npm run gerar-dados` processe todos os anos disponíveis em `downloads/`
**para** gerar as pastas de dados `frontend/src/assets/data/<ano>/` e a pasta `frontend/src/assets/data/todos/`, além do arquivo `anos.json`.

#### AC-035 — Lista de anos disponíveis gerada em anos.json

- **Dado** que existem diretórios com CSVs em `downloads/2025/`
- **Quando** o script `npm run gerar-dados` é executado sem argumentos de ano
- **Então** o arquivo `frontend/src/assets/data/anos.json` é criado contendo um array com os anos encontrados e a opção "todos" (ex: `["todos", "2025"]`)

#### AC-036 — Dados individuais e consolidados gerados nas subpastas de assets/data

- **Dado** que existem diretórios com CSVs válidos em `downloads/`
- **Quando** o script `npm run gerar-dados` é executado
- **Então** são criados os 4 arquivos JSON (`resumo-execucao.json`, `programa-acao.json`, `fornecedores.json`, `documentos.json`) tanto na pasta de cada ano específico quanto na pasta `todos/`

### US-019 — Seleção de ano no Frontend atualiza todas as visualizações

**Como** usuário do dashboard,
**quero** selecionar um ano ou "Todos os anos" no seletor da barra superior
**para** visualizar instantaneamente os indicadores e gráficos correspondentes àquele período.

#### AC-037 — Seletor de ano exibido na barra superior (mat-toolbar)

- **Dado** que a aplicação Angular é carregada no navegador
- **Quando** a barra de navegação superior é renderizada
- **Então** um componente de seleção `<mat-select>` é exibido listando os anos disponíveis obtidos de `assets/data/anos.json` com a opção "Todos os anos"

#### AC-038 — Troca de ano atualiza os dados de todos os componentes

- **Dado** que o usuário está navegando no dashboard
- **Quando** o usuário seleciona um ano diferente (ex: "2025" ou "Todos os anos") no seletor
- **Então** o `DespesasService` emite os novos dados e todos os gráficos e tabelas são recarregados para o ano selecionado

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-001 | Os anos disponíveis correspondem aos subdiretórios não vazios dentro de `downloads/`. | confirmada | O script `gerar-dados.ts` detecta dinamicamente as pastas em `downloads/`. |
| ASM-002 | O valor padrão inicial selecionado pode ser o ano mais recente ou "todos". | confirmada | Padrão inicial definido como o ano mais recente disponível. |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-001 | Onde posicionar o seletor de ano? | respondida | Na barra superior (`mat-toolbar`), alinhado à direita com componente Angular Material. |
