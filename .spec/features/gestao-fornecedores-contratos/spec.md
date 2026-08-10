# Spec: Gestao fornecedores contratos

> feature: gestao-fornecedores-contratos
> status: rascunho

## Contexto

Esta funcionalidade provê a gestão e análise de fornecedores, credores e categorias de despesa (Locação de Mão de Obra, Serviços PJ, Investimentos vs Custeio).

## Histórias

### US-004 — Análise de Fornecedores e Categoria de Despesas

Como fiscal de contratos ou cidadão,
Quero consultar os maiores fornecedores pagos e a divisão por categoria de contrato,
Para auditoria e acompanhamento do uso de recursos terceirizados.

#### AC-008 — Ranking dos Maiores Fornecedores/Credores

- **Dado** o histórico detalhado de pagamentos por credor
- **Quando** o painel de fornecedores for aberto
- **Então** o sistema deve listar os 10 maiores fornecedores ordenados por valor total acumulado.

#### AC-009 — Agrupamento por Elemento de Despesa (Mão de Obra, Concessionárias, Equipamentos)

- **Dado** a classificação por Elementos de Despesa
- **Quando** a distribuição de custos for consultada
- **Então** o sistema deve exibir os valores totais em Mão de Obra Terceirizada (Elemento 37), Serviços PJ (Elemento 39) e Equipamentos (Elemento 52).

## Fora de escopo

- Download individual de PDFs de contratos físicos.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-004 | O campo Favorecido em `documentos.csv` contém o CNPJ/CPF concatenado com a Razão Social. | confirmada | Tratamento via substring/regex se necessário. |

## Perguntas em aberto

Nenhuma.
