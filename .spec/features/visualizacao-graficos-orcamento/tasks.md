# tasks.md — visualizacao-graficos-orcamento

## T-011 — Ajustar backend: top 5 fornecedores e endpoint de categorias [concluida]

- Refs: US-008, AC-014, AC-015
- Arquivos: Backend/Api/Features/Despesas/DespesasFornecedoresService.cs, Backend/Api.Tests/GraficosTests.cs
- Notas: Alterar Take(10) para Take(5). Testes anotados com @spec:AC-014 e @spec:AC-015.
## T-012 — Instalar ng-apexcharts e configurar no Angular [concluida]

- Refs: US-006, US-007, US-008, AC-011, AC-012, AC-013, AC-014, AC-015
- Arquivos: Frontend/package.json
- Notas: ng-apexcharts e apexcharts instalados via npm.

## T-013 — Gráficos de evolução mensal na aba Painel de Execução [concluida]

- Refs: US-006, AC-011, AC-012
- Arquivos: Frontend/src/app/features/painel-execucao/painel-execucao.ts, Frontend/src/app/features/painel-execucao/painel-execucao.html
- Notas: Gráfico de área (AC-011) e barras agrupadas (AC-012) adicionados.

## T-014 — Gráfico comparativo na aba Assistência Estudantil [concluida]

- Refs: US-007, AC-013
- Arquivos: Frontend/src/app/features/destinacao-estudantil/destinacao-estudantil.ts, Frontend/src/app/features/destinacao-estudantil/destinacao-estudantil.html
- Notas: Barras comparativas Assistência vs. Funcionamento adicionadas.

## T-015 — Gráfico donut e top 5 fornecedores (nova aba + aba existente) [concluida]

- Refs: US-008, AC-014, AC-015
- Arquivos: Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.ts, Frontend/src/app/features/gestao-fornecedores/gestao-fornecedores.html, Frontend/src/app/features/categorias/categorias.ts, Frontend/src/app/features/categorias/categorias.html
- Notas: Top 5 horizontal na aba Gestão. Novo componente categorias com donut por Elemento de Despesa.
