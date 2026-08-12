# Spec: Seletor de Ação e Gráficos de Linha (Evolução e Acumulado) na Assistência Estudantil

> feature: seletor-acoes-graficos-assistencia
> status: implementada

## Contexto

Garantir que a aba "Assistência Estudantil" possua um botão de alternância/seletor (Ação 2994 vs Ação 20RL) permitindo isolar a análise de cada uma das duas ações.
Além disso, ambos os gráficos temporais da aba (Evolução Mensal e Curva Acumulada Mensal) devem ser renderizados estritamente no formato de **gráficos de linha** (`type: 'line'`).

## Histórias

### US-013 — Seletor de Ação Orçamentária e Gráficos de Linha

Como cidadão ou gestor,
Quero alternar via botões entre as ações 2994 e 20RL e visualizar ambos os gráficos (Evolução Mensal e Acumulado) no formato de linhas,
Para comparar o comportamento mensal e acumulado de cada ação de forma clara e limpa.

#### AC-021 — Botão de Seleção/Alternância entre Ações 2994 e 20RL

- **Dado** o componente da aba Assistência Estudantil com dados das ações `2994` e `20RL`
- **Quando** o usuário clicar no botão de seleção de ação (ex: "Ação 2994 — Assistência Estudantil" ou "Ação 20RL — Funcionamento")
- **Então** os gráficos da página devem atualizar para exibir as métricas da ação selecionada.

#### AC-022 — Gráficos de Evolução Mensal e Acumulado no Formato de Linhas

- **Dado** a exibição dos gráficos temporais na aba Assistência Estudantil
- **Quando** os gráficos de Evolução Mensal e Curva Acumulada forem renderizados
- **Então** ambos devem utilizar o tipo de gráfico de linhas (`type: 'line'`).

## Fora de escopo

- Alterações nas tabelas dos fornecedores.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-014 | `mat-button-toggle-group` ou `mat-chip-option` é adequado para a seleção de ação. | confirmada | Oferece a melhor UX no Angular Material. |

## Perguntas em aberto

Nenhuma.
