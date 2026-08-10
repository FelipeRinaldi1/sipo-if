# Spec: Destinacao orcamento estudantil

> feature: destinacao-orcamento-estudantil
> status: rascunho

## Contexto

Esta funcionalidade provê a visualização analítica da destinação de recursos por Programa Orçamentário e Ação (com destaque para a Assistência Estudantil - Ação 2994 vs Funcionamento - Ação 20RL).

## Histórias

### US-003 — Análise de Recursos por Programa e Assistência Estudantil

Como estudante ou conselheiro de campus,
Quero acompanhar os recursos destinados à Assistência Estudantil comparados ao custo operacional do campus,
Para verificar a distribuição e aplicação das verbas estudantis.

#### AC-006 — Distribuição Percentual por Ação Orçamentária (Gráfico de Rosca/Donut)

- **Dado** o orçamento categorizado por Ações Orçamentárias
- **Quando** o painel de destinação for visualizado
- **Então** o sistema deve exibir a proporção percentual entre Assistência Estudantil (2994) e Manutenção/Funcionamento (20RL).

#### AC-007 — Evolução Mensal do Investimento em Assistência Estudantil

- **Dado** o histórico mensal de gastos da Ação 2994
- **Quando** o gráfico de apoio aos estudantes for consultado
- **Então** ele deve apresentar o valor mensal pago aos programas de assistência ao longo do ano.

## Fora de escopo

- Detalhamento nominal de alunos beneficiados por bolsa.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-003 | A Ação 2994 refere-se exclusivamente à Assistência aos Estudantes da Rede Federal. | confirmada | Baseado no padrão do MEC. |

## Perguntas em aberto

Nenhuma.
