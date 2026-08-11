# tasks.md — visualizacao-graficos-orcamento

## T-011 — Ajustar backend: top 5 fornecedores e endpoint de categorias
Refs: US-008, AC-014, AC-015
Arquivos: Backend/Features/Despesas/DespesasFornecedoresService.cs, Backend.Tests/GraficosTests.cs
Esforço: baixo

Alterar `Take(10)` para `Take(5)` no serviço de fornecedores.
Garantir que `ElementosDespesa` já está no payload de `/api/despesas/fornecedores`.
Escrever testes anotados com `@spec:AC-014` e `@spec:AC-015`.

---

## T-012 — Instalar ng-apexcharts e configurar no Angular
Refs: US-006, US-007, US-008, AC-011, AC-012, AC-013, AC-014, AC-015
Arquivos: Frontend/package.json, Frontend/src/app/app.ts
Esforço: baixo

Instalar `ng-apexcharts` e `apexcharts` via npm.
Importar `NgApexchartsModule` no app.ts.

---

## T-013 — Gráficos de evolução mensal na aba Painel de Execução
Refs: US-006, AC-011, AC-012
Arquivos: Frontend/src/app/features/painel-execucao/painel-execucao.ts, Frontend/src/app/features/painel-execucao/painel-execucao.html
Esforço: medio

Adicionar gráfico de área (AC-011) e barras agrupadas (AC-012) abaixo dos cards de KPIs.
Dados vêm do endpoint existente `/api/despesas/resumo-execucao` (campo `evolucaoMensal`).

---

## T-014 — Gráfico comparativo na aba Assistência Estudantil
Refs: US-007, AC-013
Arquivos: Frontend/src/app/features/destinacao-estudantil/destinacao-estudantil.ts, Frontend/src/app/features/destinacao-estudantil/destinacao-estudantil.html
Esforço: medio

Adicionar gráfico de barras comparando Assistência Estudantil vs. Funcionamento do Campus.
Dados vêm do endpoint existente `/api/despesas/programa-acao`.

---

## T-015 — Gráfico donut e top 5 fornecedores (nova aba + aba existente)
Refs: US-008, AC-014, AC-015
Arquivos: Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.ts, Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.html, Frontend/src/app/features/categorias/categorias.ts, Frontend/src/app/features/categorias/categorias.html, Frontend/src/app/app.html, Frontend/src/app/app.ts
Esforço: medio

Adicionar gráfico de barras horizontais Top 5 fornecedores na aba Gestão de Fornecedores.
Criar novo componente `categorias` com gráfico donut de Elemento de Despesa.
Adicionar nova aba "Despesas por Categoria" no app.html.
Dados vêm de `/api/despesas/fornecedores`.
