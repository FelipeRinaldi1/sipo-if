# Plano de execução — importacao-despesas-csv

> gerado por `onp-spec plano` em 2026-08-10 20:19 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano importacao-despesas-csv`

## Resumo — o que vai acontecer

- **2 tarefa(s) pendente(s)**: 2 em 2 faixa(s) paralela(s) + 0 sequencial(is) (1 já concluída(s): T-001)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano importacao-despesas-csv --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/importacao-despesas-csv`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2

#### faixa-1 — branch `spec/importacao-despesas-csv-faixa-1` — worktree `../onp-worktrees/sipo-if-importacao-despesas-csv-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-002 | Criar Serviço de Ingestão e Parser CSV no Backend | `claude-sonnet-5` | medium | `Backend/Features/Despesas/DespesasImportService.cs` |

#### faixa-2 — branch `spec/importacao-despesas-csv-faixa-2` — worktree `../onp-worktrees/sipo-if-importacao-despesas-csv-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-003 | Testes Unitários de Importação dos CSVs | `claude-sonnet-5` | medium | `Backend.Tests/ImportacaoDespesasTests.cs` |

## Gestão de branches e commits

1. branch de trabalho `spec/importacao-despesas-csv` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify importacao-despesas-csv` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/importacao-despesas-csv   # ou: git checkout spec/importacao-despesas-csv
git worktree add ../onp-worktrees/sipo-if-importacao-despesas-csv-faixa-1 -b spec/importacao-despesas-csv-faixa-1
git worktree add ../onp-worktrees/sipo-if-importacao-despesas-csv-faixa-2 -b spec/importacao-despesas-csv-faixa-2
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "importacao-despesas-csv" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-importacao-despesas-csv-faixa-1 (branch spec/importacao-despesas-csv-faixa-1) — já preparado.
Leia primeiro: .spec/features/importacao-despesas-csv/spec.md, .spec/features/importacao-despesas-csv/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-002 — "Criar Serviço de Ingestão e Parser CSV no Backend"
  critérios/refs: AC-001 (Importação de Despesas por Órgão), AC-002 (Importação de Despesas por Programa e Ação), AC-003 (Importação de Extrato de Documentos)
  arquivos permitidos (e seus testes): Backend/Features/Despesas/DespesasImportService.cs
  mensagem de commit: "T-002 importacao-despesas-csv: Criar Serviço de Ingestão e Parser CSV no Backend"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `dotnet test Backend.Tests --logger:trx && node --test --test-reporter=tap test/**/*.test.js` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-2

```
Você executa as tarefas da faixa-2 da feature "importacao-despesas-csv" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-importacao-despesas-csv-faixa-2 (branch spec/importacao-despesas-csv-faixa-2) — já preparado.
Leia primeiro: .spec/features/importacao-despesas-csv/spec.md, .spec/features/importacao-despesas-csv/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-003 — "Testes Unitários de Importação dos CSVs"
  critérios/refs: AC-001 (Importação de Despesas por Órgão), AC-002 (Importação de Despesas por Programa e Ação), AC-003 (Importação de Extrato de Documentos)
  arquivos permitidos (e seus testes): Backend.Tests/ImportacaoDespesasTests.cs
  mensagem de commit: "T-003 importacao-despesas-csv: Testes Unitários de Importação dos CSVs"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `dotnet test Backend.Tests --logger:trx && node --test --test-reporter=tap test/**/*.test.js` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

3. **Todas terminaram? Mescle na ordem e marque as tarefas** (na árvore principal):

```bash
git merge --no-ff spec/importacao-despesas-csv-faixa-1 -m "merge faixa-1 (importacao-despesas-csv)"
git worktree remove ../onp-worktrees/sipo-if-importacao-despesas-csv-faixa-1 && git branch -d spec/importacao-despesas-csv-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa importacao-despesas-csv T-002 concluida
git merge --no-ff spec/importacao-despesas-csv-faixa-2 -m "merge faixa-2 (importacao-despesas-csv)"
git worktree remove ../onp-worktrees/sipo-if-importacao-despesas-csv-faixa-2 && git branch -d spec/importacao-despesas-csv-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa importacao-despesas-csv T-003 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify importacao-despesas-csv
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run sipo-if-importacao-despesas-csv-msnod66q --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run sipo-if-importacao-despesas-csv-msnod66q --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo importacao-despesas-csv --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo importacao-despesas-csv --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

