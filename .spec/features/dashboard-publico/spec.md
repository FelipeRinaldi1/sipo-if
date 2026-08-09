# Spec: Dashboard publico

> feature: dashboard-publico
> status: rascunho

<!--
  Como ler este arquivo (o formato é verificado por `onp-spec audit`):
  - US-xxx = história de usuário · AC-xxx = critério de aceite
    ASM-xxx = suposição · Q-xxx = pergunta em aberto
    São códigos de rastreio: ligam a especificação às tarefas e aos testes.
  - Toda história de usuário precisa de pelo menos um critério de aceite.
  - Todo critério de aceite precisa de Dado/Quando/Então completos.
  - Os códigos são únicos no projeto inteiro (nunca reutilize um número).
  - Suposições e Perguntas em aberto são OBRIGATÓRIAS: se não há nenhuma,
    escreva "Nenhuma." — mas desconfie: quase toda feature esconde uma.
-->

## Contexto

Oferecer aos alunos, servidores e comunidade externa um dashboard simples, gráfico e intuitivo sobre o uso dos recursos do IFSP Campus Jacareí, consolidando os valores acumulados no ano (Empenhado, Liquidado e Pago), a divisão entre Custeio vs Capital, suporte a filtros por Ano e Natureza de Despesa, e glossário interativo de termos orçamentários técnicos.

## Histórias

### US-003 — Exibição de Indicadores Orçamentários e Filtros no Dashboard Público

Como cidadão ou membro da comunidade acadêmica, quero visualizar em um painel interativo os totais acumulados no ano e filtrar por ano/natureza de despesa, para acompanhar o uso dos recursos do campus com clareza.

#### AC-006 — Exibição dos totais acumulados de empenhado, liquidado e pago

- **Dado** que existem dados orçamentários sincronizados no banco de dados
- **Quando** o usuário acessa o Dashboard Público
- **Então** o sistema exibe cartões do Angular Material (`mat-card`) com os totais de Orçamento Empenhado, Liquidado e Pago formatados em Real (R$)

#### AC-007 — Gráfico de proporção Custeio vs Capital

- **Dado** que o dashboard foi carregado
- **Quando** os dados orçamentários são renderizados
- **Então** o sistema exibe a proporção percentual entre despesas de Custeio (manutenção/contratos) e Capital (obras/equipamentos) utilizando componentes visuais

#### AC-008 — Filtro por Ano e Natureza de Despesa

- **Dado** que o usuário está no Dashboard Público
- **Quando** seleciona um Ano específico ou uma Natureza de Despesa no `mat-select`
- **Então** os cartões e gráficos são recalculados imediatamente com base no filtro selecionado

### US-004 — Glossário Interativo de Termos Orçamentários

Como usuário leigo em orçamento público, quero passar o mouse sobre os termos técnicos (como Empenhado, Liquidado, Custeio) e ver explicações simples, para entender facilmente o significado dos números.

#### AC-009 — Tooltips informativos em termos técnicos via Angular Material

- **Dado** que o usuário visualiza termos técnicos no dashboard (ex: Empenhado, Liquidado, Pago, Custeio, Capital)
- **Quando** passa o ponteiro do mouse ou foca no ícone de ajuda ao lado do termo
- **Então** o sistema exibe um tooltip do Angular Material (`matTooltip`) contendo a explicação didática do termo

#### AC-010 — Endpoint REST do Dashboard com agregação de dados

- **Dado** que o frontend solicita os dados do dashboard público
- **Quando** dispara requisição GET para `/transparencia/dashboard` (com query params opcionais `ano`, `mes` e `naturezaDespesa`)
- **Então** o backend retorna o JSON contendo os totais agregados e o percentual Custeio vs Capital com status 200 OK

#### AC-011 — Filtro por Mês do Exercício

- **Dado** que o usuário está no Dashboard Público
- **Quando** seleciona um Mês específico (1 a 12) ou "Todos os Meses"
- **Então** o backend e a interface recalculam os totais do período selecionado

#### AC-012 — Indicador de Taxa de Execução Orçamentária

- **Dado** que os totais do dashboard foram calculados
- **Quando** a resposta é renderizada
- **Então** o sistema exibe o percentual de execução orçamentária (Valor Pago / Valor Empenhado * 100)

#### AC-013 — Top 5 Maiores Favorecidos/Fornecedores do ano

- **Dado** que existem despesas registradas com favorecidos no banco
- **Quando** o dashboard é consultado
- **Então** o sistema exibe os 5 maiores fornecedores/favorecidos em valor recebido no ano

#### AC-014 — Exportação de dados abertos em CSV

- **Dado** que o usuário visualiza o Dashboard Público
- **Quando** clica no botão "Exportar Dados (CSV)"
- **Então** o sistema dispara o download de um arquivo CSV com os dados consolidados do filtro ativo

## Fora de escopo

- Autenticação para acesso ao dashboard (o dashboard público é livre)
- Edição ou alteração de dados através do dashboard público
- Estilização CSS manual (toda a interface usa Angular Material + Tailwind apenas para layout)

## Suposições

<!-- O que estamos ASSUMINDO sem confirmação. Status: aberta | confirmada | invalidada -->

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-005 | O layout da página usará utilitários flex/grid do Tailwind CSS v4 e componentes mat-card/mat-select/mat-tooltip do Angular Material | confirmada | Regra P-018 |
| ASM-006 | Se nenhum ano for selecionado no filtro, o dashboard exibirá os dados do ano mais recente | confirmada | Padrão UX |

## Perguntas em aberto

<!-- O que ainda não sabemos. Status: aberta | respondida -->

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-005 | Quais termos técnicos devem constar no glossário inicial? | respondida | Empenhado, Liquidado, Pago, Custeio, Capital, Natureza da Despesa |
