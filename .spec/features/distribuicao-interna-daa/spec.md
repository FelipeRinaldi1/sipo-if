# Especificação da Feature: Distribuição Orçamentária Interna (DAA)

## Visão Geral
Esta funcionalidade provê transparência sobre como a **Direção Adjunta de Administração (DAA)** do IFSP Campus Jacareí distribui o orçamento interno entre os setores acadêmicos (Ensino, Pesquisa, Extensão, Assistência Estudantil, TI/Laboratórios) e realiza o monitoramento de utilidades (Contas de Água e Energia Elétrica).

Inspirada nas melhores práticas dos campi de Araraquara, Capivari, Caraguatatuba e São José dos Campos.

---

## Histórias de Usuário & Critérios de Aceite

### US-005 — Painel de Contas Públicas & Utilidades (Água e Energia)

Como membro da comunidade acadêmica
Quero visualizar o consumo e os gastos mensais de Água (SABESP) e Energia Elétrica (EDP) do campus
Para acompanhar a eficiência energética e o uso consciente de recursos.

#### AC-015 — Exibição mensal dos gastos com Água e Luz

- **Dado** que existem lançamentos das contas públicas da DAA no banco
- **Quando** o usuário seleciona a aba "Contas Públicas (Utilidades)"
- **Então** o sistema exibe os totais mensais de consumo em R$ para Água (SABESP) e Energia (EDP) com comparação mensal

---

### US-006 — Distribuição Orçamentária por Eixos Acadêmicos

Como aluno ou servidor do campus
Quero visualizar a distribuição do orçamento pelos setores do campus (Assistência Estudantil, Laboratórios, Pesquisa)
Para compreender os investimentos em cada área acadêmica.

#### AC-016 — Gráfico de Alocação Orçamentária Interna DAA

- **Dado** que a DAA cadastrou as alocações orçamentárias dos setores
- **Quando** o usuário consulta o painel de Distribuição Interna
- **Então** o sistema exibe um gráfico de setores com os percentuais de Assistência Estudantil, Laboratórios/TI, Ensino/Pesquisa e Operação

---

### US-007 — Tabela de Planejamento vs. Execução Interna DAA

Como gestor ou servidor
Quero comparar o orçamento aprovado (planejado) com o executado por código CPO e ND
Para identificar repactuações e saldos a detalhar.

#### AC-017 — Tabela detalhada de alocação com % de repactuação

- **Dado** que o usuário filtra por exercício orçamentário (ex: 2025/2026)
- **Quando** visualiza a Tabela de Execução DAA
- **Então** o sistema apresenta a listagem por Código CPO, Descrição da Despesa, ND, Aprovado, Executado e % de Repactuação

---

## Fora de Escopo
- Edição de planilhas por usuários externos sem perfil de administrador da DAA.
