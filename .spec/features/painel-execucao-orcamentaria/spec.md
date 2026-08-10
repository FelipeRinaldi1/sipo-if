# Spec: Painel execucao orcamentaria

> feature: painel-execucao-orcamentaria
> status: rascunho

## Contexto

Esta funcionalidade provê o painel executivo de saúde financeira do campus, exibindo os KPIs globais (Total Empenhado, Liquidado, Pago e Restos a Pagar) e a evolução temporal mensal.

## Histórias

### US-002 — Painel Executivo e Métricas Globais da Despesa

Como cidadão ou gestor do campus,
Quero visualizar o resumo total acumulado e a curva mensal de execução orçamentária,
Para acompanhar o desempenho financeiro anual da instituição.

#### AC-004 — Cards de Métricas Globais (Empenhado, Liquidado, Pago, Restos a Pagar)

- **Dado** o acervo de dados de despesas importado
- **Quando** o painel executivo for acessado
- **Então** o sistema deve exibir os totais acumulados de Valor Empenhado, Valor Liquidado, Valor Pago e Restos a Pagar Pagos.

#### AC-005 — Gráfico de Evolução Mensal do Orçamento

- **Dado** a série temporal mensal de despesas (de 01 a 12)
- **Quando** o gráfico de evolução for renderizado
- **Então** ele deve comparar visualmente os valores empenhados, liquidados e pagos em cada mês do ano.

## Fora de escopo

- Exportação dos gráficos em PDF/Excel.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-002 | Os totais mensais devem considerar a soma de todas as unidades gestoras caso haja mais de uma. | confirmada | Agrupamento por MesAno. |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-002 | Qual a estrutura de navegação preferida no Frontend? | respondida | Página única estilo Dashboard unificado com abas/seções por enquanto. |
