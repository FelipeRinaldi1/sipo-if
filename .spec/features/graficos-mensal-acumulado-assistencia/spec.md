# Spec: Gráficos de Evolução Mensal e Acumulada para as Ações 20RL e 2994

> feature: graficos-mensal-acumulado-assistencia
> status: implementada

## Contexto

Adicionar na aba "Assistência Estudantil" dois gráficos temporais focados especificamente nas ações **20RL** (Funcionamento) e **2994** (Assistência Estudantil):
1. **Gráfico de Evolução Mensal**: valores pagos mês a mês comparando 20RL vs 2994.
2. **Gráfico de Curva Acumulada**: evolução acumulada mês a mês no ano comparando a soma progressiva paga de 20RL vs 2994.

## Histórias

### US-012 — Visualização Temporal Mensal e Acumulada das Ações 20RL e 2994

Como cidadão ou gestor do campus,
Quero visualizar gráficos mensais e acumulados comparando as ações 20RL e 2994 ao longo do ano,
Para acompanhar como o fluxo de recursos entre assistência aos estudantes e manutenção do campus se comporta mês a mês.

#### AC-019 — Gráfico de Evolução Mensal 20RL vs 2994

- **Dado** a série mensal de pagamentos das ações
- **Quando** a aba "Assistência Estudantil" for renderizada
- **Então** deve ser exibido um gráfico de evolução mensal comparando os valores pagos da Ação 2994 e Ação 20RL mês a mês.

#### AC-020 — Gráfico de Curva Acumulada 20RL vs 2994

- **Dado** a série mensal de pagamentos das ações
- **Quando** a aba "Assistência Estudantil" for renderizada
- **Então** deve ser exibido um gráfico de linhas de curva acumulada somando mês a mês o total pago da Ação 2994 e Ação 20RL.

## Fora de escopo

- Alterações em outras abas do sistema.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-013 | Os dados mensais da Ação 2994 já são disponibilizados no endpoint de resumo da ação. | confirmada | Disponível em `evolucaoAssistenciaMensal`. |

## Perguntas em aberto

Nenhuma.
