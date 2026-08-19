# Spec: Gestao fornecedores contratos

> feature: gestao-fornecedores-contratos
> status: implementada

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

#### AC-039 — Gráfico de Evolução Temporal por Fornecedor (Linha/Área)

- **Dado** o histórico temporal de pagamentos agrupado por credor e mês (`evolucaoMensal`)
- **Quando** um fornecedor for selecionado no painel
- **Então** o sistema deve renderizar o gráfico temporal de pagamentos no formato de Área ou Linha, permitindo alternância entre os modos.

#### AC-040 — Barra de Pesquisa com Autocomplete de Fornecedores

- **Dado** a listagem completa de credores e fornecedores
- **Quando** o usuário pesquisar por CNPJ ou Razão Social
- **Então** o componente de autocomplete deve filtrar as opções em tempo real e atualizar o gráfico ao selecionar.

#### AC-041 — Gráfico de Concentração Orçamentária dos Fornecedores (Barras Ranqueadas)

- **Dado** o montante total pago aos fornecedores e credores
- **Quando** a visualização de concentração for renderizada
- **Então** o sistema deve exibir um gráfico em barras horizontais ranqueadas destacando de 10 a 15 maiores empresas/credores e agrupando o saldo restante como "Demais Fornecedores / Outros", com valores e percentuais de participação.

## Fora de escopo

- Gráfico de Pareto 80/20 e ranking isolado de barras top 5 (substituídos pela visão integrada de Concentração Orçamentária e tabela analítica).
- Card de contagem de lançamentos contábeis.
- Download individual de PDFs de contratos físicos.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-004 | O campo Favorecido em `documentos.csv` contém o CNPJ/CPF concatenado com a Razão Social. | confirmada | Tratamento via substring/regex se necessário. |

## Perguntas em aberto

Nenhuma.
