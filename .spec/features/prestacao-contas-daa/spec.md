# Especificação da Feature: Prestação de Contas & Gestão DAA

## Visão Geral
Esta funcionalidade disponibiliza o mural de **Comunicados, Ofícios e Relatórios Oficiais de Gestão** publicados pela equipe da Direção Adjunta de Administração (DAA) para a comunidade do IFSP Campus Jacareí.

Inspirada nos portais dos campi de Capivari, Boituva e São José dos Campos.

---

## Histórias de Usuário & Critérios de Aceite

### US-008 — Mural de Comunicados & Ofícios Orçamentários

Como aluno ou servidor
Quero acessar as notas oficiais, informativos e ofícios publicados pela DAA
Para ficar ciente dos prazos de auxílios, aberturas de crédito e informes orçamentários.

#### AC-018 — Listagem de Comunicados e Informes da DAA

- **Dado** que a DAA publicou comunicados orçamentários
- **Quando** o usuário acessa o mural de Prestação de Contas
- **Então** o sistema exibe os comunicados em ordem cronológica com título, data, resumo e link para leitura do documento PDF

---

### US-009 — Central de Download de Relatórios de Gestão

Como órgão de controle ou cidadão
Quero baixar os Relatórios Anuais de Gestão e Planos de Contratação (PCA) do campus Jacareí
Para exercer o controle social e verificar o cumprimento da LAI (Lei nº 12.527).

#### AC-019 — Central de Documentos e Relatórios Anuais

- **Dado** que existem relatórios de gestão cadastrados por ano
- **Quando** o usuário consulta a Central de Relatórios
- **Então** o sistema disponibiliza os arquivos para download em PDF/ODT organizados por exercício fiscal (ex: Relatório de Gestão 2024, PCA 2025)

---

## Fora de Escopo
- Assinatura digital via token A3 de documentos dentro do portal.
