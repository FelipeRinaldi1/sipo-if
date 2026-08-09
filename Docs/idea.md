# Documento de Visão e Ideia do Projeto — SIPO-IF

**Sistema Integrado de Planejamento e Orçamento do IFSP Campus Jacareí**

---

## 🎯 Objetivo do Projeto

O **SIPO-IF** é uma plataforma web para transparência orçamentária e gestão de gastos públicos do **Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP) — Campus Jacareí** (Unidade Gestora: `158716` | Órgão Vinculado: `26439`).

O sistema resolve a falta de visibilidade e fragmentação dos dados financeiros em planilhas soltas, oferecendo um portal moderno, interativo e aderente às diretrizes da **Lei de Acesso à Informação (LAI nº 12.527)** e ao **Preset LGPD**.

---

## 🏛️ Módulos da Plataforma (Baseados na Análise dos Campi IFSP)

### 🌐 Módulo 1 — Execução Orçamentária Governamental (Portal Gov / SIAFI) — [CONCLUÍDO]

> **Origem dos Dados:** Sincronização automatizada via API com o Portal da Transparência do Governo Federal.

- **Indicadores Principais (KPIs):** Empenhado, Liquidado, Pago e Taxa de Execução Orçamentária (%).
- **Custeio vs. Capital:** Gráfico e proporção de manutenção contínua vs. investimentos.
- **Top 5 Maiores Favorecidos:** Transparência ativa dos maiores contratos e fornecedores.
- **Filtros Dinâmicos:** Por Ano (2020 a 2026), Mês e Natureza de Despesa.
- **Dados Abertos:** Exportação consolidada em CSV.

---

### 📊 Módulo 2 — Distribuição Orçamentária Interna da DAA — [FASE 2]

> **Origem dos Dados:** Lançamentos da Direção Adjunta de Administração (DAA) do Campus Jacareí.

- **Painel de Contas Públicas & Utilidades:** Monitoramento mês a mês dos gastos com **Água** e **Energia Elétrica** do campus.
- **Distribuição por Eixos Acadêmicos:** Alocação de verbas por setores:
  - 🎓 Assistência Estudantil & Apoio ao Discente (Bolsas e Auxílios)
  - 🔬 Laboratórios & Insumos Didáticos (TI e Reativos)
  - 📚 Ensino, Pesquisa e Extensão
  - 🏢 Manutenção Geral e Operacional do Campus
- **Tabela Planejado vs. Executado:** Detalhamento por CPO, Descrição da Despesa, ND e % de Repactuação.
- **Comparativo entre Exercícios:** Análise comparativa orçamentária (ex: 2025 vs 2026).

---

### 📑 Módulo 3 — Prestação de Contas & Gestão DAA — [FASE 3]

> **Origem dos Dados:** Publicações e documentos oficiais da equipe administrativa.

- **Mural de Comunicados Orçamentários:** Informativos e ofícios publicados pela DAA para a comunidade acadêmica.
- **Central de Relatórios de Gestão:** Acesso centralizado a Relatórios de Gestão, Pregões e Plano de Contratação Anual (PCA).
- **Conformidade LAI:** Indicadores de transparência passiva e atendimento a solicitações.

---

## 🛠️ Stack Tecnológica & Arquitetura

- **Backend:** .NET 10 Web API (Minimal APIs, Vertical Slice Architecture, EF Core, PostgreSQL local).
- **Frontend:** Angular 22 Standalone + Angular Material v22 (Componentes/Estilos) + Tailwind CSS v4 (Layout).
- **Testes & Especificação:** Spec-Driven Development com `onp-spec` + TDD no backend com `xUnit`.
