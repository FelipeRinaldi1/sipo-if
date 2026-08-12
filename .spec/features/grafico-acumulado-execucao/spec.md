# Spec: Gráfico Acumulado de Execução Orçamentária

> feature: grafico-acumulado-execucao
> status: implementada

## Contexto

Adicionar na aba "Painel de Execução" um gráfico de curva acumulada ao longo dos meses para acompanhar a evolução progressiva total do Empenhado, Liquidado e Pago no ano.
Enquanto os gráficos existentes mostram os valores mensais isolados, o gráfico acumulado permite ao gestor e ao cidadão visualizar o ritmo de consumo do orçamento acumulado até cada mês.

## Histórias

### US-010 — Gráfico Acumulativo de Execução Orçamentária ao Longo dos Meses

Como cidadão ou gestor do campus,
Quero visualizar um gráfico com a evolução acumulada mês a mês dos valores Empenhado, Liquidado e Pago,
Para compreender o ritmo de execução orçamentária progressiva e a soma acumulada até cada mês do ano.

#### AC-017 — Exibição do Gráfico de Linhas/Área Acumulado

- **Dado** a série temporal mensal de despesas
- **Quando** a aba "Painel de Execução" for carregada
- **Então** deve ser exibido um gráfico de linhas/área acumuladas acumulando progressivamente mês a mês os totais de Empenhado, Liquidado e Pago.

## Fora de escopo

- Alteração nos endpoints do backend (a acumulação é calculada no frontend sobre a série mensal já retornada).

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-011 | A acumulação pode ser derivada no frontend somando o valor do mês corrente com a soma dos meses anteriores. | confirmada | Permite melhor performance sem alterações na API backend. |

## Perguntas em aberto

Nenhuma.
