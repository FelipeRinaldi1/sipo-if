# Spec: Visualização de Gráficos Orçamentários

> feature: visualizacao-graficos-orcamento
> status: implementada

## Contexto

Esta funcionalidade provê visualizações gráficas do orçamento do campus IFSP Jacareí,
permitindo que qualquer cidadão — sem conhecimento técnico em finanças públicas — compreenda
como o dinheiro público está sendo gasto ao longo do ano.

Os dados vêm de três CSVs já importados no sistema:
- `despesasPorOrgao.csv` — execução mensal (Empenhado, Liquidado, Pago, Restos a Pagar)
- `despesasPorProgramaAcao.csv` — execução por ação orçamentária (Assistência Estudantil vs. Funcionamento)
- `documentos.csv` — documentos individuais com Elemento de Despesa e Favorecido (fornecedor)

**Biblioteca de gráficos:** `ng-apexcharts` (ApexCharts para Angular) — escolhida por visual polido,
animações ricas e tooltips avançados, adequados para um dashboard de transparência pública.

## Histórias

### US-006 — Gráficos de Evolução Mensal da Execução

Como cidadão que acessa o portal de transparência,
Quero ver como os gastos do campus evoluíram mês a mês durante o ano,
Para entender se o campus está gastando de forma contínua ou concentrada em períodos.

**Localização na UI:** integrado à aba existente **"Painel de Execução"**, abaixo dos cards de KPIs.

#### AC-011 — Gráfico de área: Empenhado vs. Liquidado vs. Pago por mês

- **Dado** a série temporal de despesas agrupadas por mês (`despesasPorOrgao`)
- **Quando** o gráfico de área for exibido na aba "Painel de Execução"
- **Então** deve apresentar três séries distintas (Empenhado, Liquidado, Pago) ao longo dos meses do ano, permitindo comparação visual entre as fases de execução orçamentária.

#### AC-012 — Gráfico de barras agrupadas: comparativo mensal

- **Dado** a mesma série temporal mensal
- **Quando** o gráfico de barras agrupadas for exibido na aba "Painel de Execução"
- **Então** deve mostrar barras lado a lado por mês com valores de Empenhado, Liquidado e Pago, facilitando a leitura do desempenho de cada mês individualmente.

---

### US-007 — Gráfico Comparativo: Assistência Estudantil vs. Funcionamento

Como cidadão,
Quero entender como o orçamento é dividido entre assistência aos estudantes e manutenção do campus,
Para saber qual parcela do dinheiro público beneficia diretamente os alunos.

**Localização na UI:** integrado à aba existente **"Assistência Estudantil"**.

#### AC-013 — Gráfico de barras: Assistência Estudantil vs. Funcionamento do Campus

- **Dado** os registros de `despesasPorProgramaAcao` agrupados por ação orçamentária
- **Quando** o gráfico comparativo for exibido na aba "Assistência Estudantil"
- **Então** deve mostrar o valor total empenhado e pago de cada ação (Ação 2994 — Assistência Estudantil vs. Ação 20RL — Funcionamento do Campus), permitindo comparação direta entre as duas destinações orçamentárias.

---

### US-008 — Gráficos de Detalhamento por Categoria e Fornecedor

Como cidadão,
Quero ver de forma visual em que categorias específicas o campus gasta e quem recebe os pagamentos,
Para entender o destino real do dinheiro público.

#### AC-014 — Gráfico de donut: distribuição por Elemento de Despesa

- **Dado** os documentos importados com campo `Elemento de Despesa`
- **Quando** o gráfico de distribuição for exibido na nova aba **"Despesas por Categoria"**
- **Então** deve agrupar os documentos por elemento (ex: Auxílio a Estudantes, Locação de Mão de Obra, Serviços de TI, Diárias, etc.) e mostrar a proporção de cada categoria sobre o total, em gráfico de donut com legendas claras.

#### AC-015 — Gráfico de barras horizontais: top 5 fornecedores por valor pago

- **Dado** os documentos com fase `Pagamento`, campos `Favorecido` e `VALOR`
- **Quando** o ranking de fornecedores for exibido na aba existente **"Gestão de Fornecedores"**
- **Então** deve listar os **5 maiores favorecidos** com o valor total recebido, ordenado de forma decrescente, em gráfico de barras horizontais.

---

## Mapeamento de Gráficos por Aba

| Aba | Gráfico | AC | Fonte de Dados |
|---|---|---|---|
| Painel de Execução (existente) | Área mensal — Empenhado/Liquidado/Pago | AC-011 | `despesasPorOrgao` |
| Painel de Execução (existente) | Barras agrupadas mensais | AC-012 | `despesasPorOrgao` |
| Assistência Estudantil (existente) | Barras — Assistência vs. Funcionamento | AC-013 | `despesasPorProgramaAcao` |
| **Despesas por Categoria (nova)** | Donut — Elemento de Despesa | AC-014 | `documentos` |
| Gestão de Fornecedores (existente) | Barras horizontais — Top 5 fornecedores | AC-015 | `documentos` |

---

## Fora de escopo

- Filtros por período ou por fornecedor específico.
- Exportação dos gráficos em PDF/Excel.
- Gráficos em tempo real ou atualização automática.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-006 | Os dados já foram importados via CSV e estão disponíveis no banco de dados. | confirmada | Importação implementada em US-001. |
| ASM-007 | Para o top de fornecedores, considera-se apenas documentos na fase "Pagamento". | confirmada | Filtro por fase confirmado pelo usuário. |
| ASM-008 | A biblioteca de gráficos será `ng-apexcharts`. | confirmada | Escolhida por visual polido e animações ricas. |
| ASM-009 | O ranking de fornecedores exibe os top 5. | confirmada | Definido pelo usuário. |

## Perguntas em aberto

Nenhuma.
