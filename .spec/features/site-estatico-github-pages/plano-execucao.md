# Plano de execução — site-estatico-github-pages

> gerado por `onp-spec plano` em 2026-08-13 19:08 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano site-estatico-github-pages`

## Resumo — o que vai acontecer

- **4 tarefa(s) pendente(s)**: 4 em 4 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano site-estatico-github-pages --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/site-estatico-github-pages`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/site-estatico-github-pages-faixa-1` — worktree `../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-023 | Criar scripts TypeScript de agregação dos CSVs e geração de JSONs | `claude-sonnet-5` | medium | `scripts/gerar-dados.ts`, `scripts/aggregators/dashboard.ts`, `scripts/aggregators/programa-acao.ts`, `scripts/aggregators/fornecedores.ts`, `scripts/aggregators/documentos.ts`, `scripts/types.ts` |

#### faixa-2 — branch `spec/site-estatico-github-pages-faixa-2` — worktree `../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-024 | Alterar `DespesasService` Angular para ler JSONs locais | `claude-sonnet-5` | low | `Frontend/src/app/core/services/despesas.service.ts`, `Frontend/src/environments/environment.ts`, `Frontend/src/environments/environment.development.ts` |

#### faixa-3 — branch `spec/site-estatico-github-pages-faixa-3` — worktree `../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-025 | Criar workflow GitHub Actions com deploy no GitHub Pages | `claude-sonnet-5` | low | `.github/workflows/atualizar-dados.yml` |

### Onda 2 — faixa-4

#### faixa-4 — branch `spec/site-estatico-github-pages-faixa-4` — worktree `../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-026 | Criar script Playwright em TypeScript de download dos CSVs | `claude-sonnet-5` | medium | `scripts/baixar-csvs.ts`, `scripts/package.json` |

## Gestão de branches e commits

1. branch de trabalho `spec/site-estatico-github-pages` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify site-estatico-github-pages` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/site-estatico-github-pages   # ou: git checkout spec/site-estatico-github-pages
git worktree add ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-1 -b spec/site-estatico-github-pages-faixa-1
git worktree add ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-2 -b spec/site-estatico-github-pages-faixa-2
git worktree add ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-3 -b spec/site-estatico-github-pages-faixa-3
git worktree add ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-4 -b spec/site-estatico-github-pages-faixa-4
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "site-estatico-github-pages" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-1 (branch spec/site-estatico-github-pages-faixa-1) — já preparado.
Leia primeiro: .spec/features/site-estatico-github-pages/spec.md, .spec/features/site-estatico-github-pages/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-023 — "Criar scripts TypeScript de agregação dos CSVs e geração de JSONs"
  critérios/refs: AC-023 (resumo-execucao.json gerado com estrutura correta), AC-024 (programa-acao.json gerado com estrutura correta), AC-025 (fornecedores.json gerado com estrutura correta), AC-026 (Script retorna erro claro quando CSV não existe)
  arquivos permitidos (e seus testes): scripts/gerar-dados.ts, scripts/aggregators/dashboard.ts, scripts/aggregators/programa-acao.ts, scripts/aggregators/fornecedores.ts, scripts/aggregators/documentos.ts, scripts/types.ts
  mensagem de commit: "T-023 site-estatico-github-pages: Criar scripts TypeScript de agregação dos CSVs e geração de JSONs"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `dotnet test Backend/Api.Tests --logger:trx && node --experimental-strip-types --test --test-reporter=tap Frontend/test/**/*.spec.test.ts` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-2

```
Você executa as tarefas da faixa-2 da feature "site-estatico-github-pages" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-2 (branch spec/site-estatico-github-pages-faixa-2) — já preparado.
Leia primeiro: .spec/features/site-estatico-github-pages/spec.md, .spec/features/site-estatico-github-pages/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-024 — "Alterar `DespesasService` Angular para ler JSONs locais"
  critérios/refs: AC-027 (DespesasService aponta para assets locais (resumo-execucao)), AC-028 (DespesasService aponta para assets locais (programa-acao e fornecedores)), AC-029 (Documentos paginados servidos por JSON local com paginação no cliente)
  arquivos permitidos (e seus testes): Frontend/src/app/core/services/despesas.service.ts, Frontend/src/environments/environment.ts, Frontend/src/environments/environment.development.ts
  mensagem de commit: "T-024 site-estatico-github-pages: Alterar `DespesasService` Angular para ler JSONs locais"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `dotnet test Backend/Api.Tests --logger:trx && node --experimental-strip-types --test --test-reporter=tap Frontend/test/**/*.spec.test.ts` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-3

```
Você executa as tarefas da faixa-3 da feature "site-estatico-github-pages" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-3 (branch spec/site-estatico-github-pages-faixa-3) — já preparado.
Leia primeiro: .spec/features/site-estatico-github-pages/spec.md, .spec/features/site-estatico-github-pages/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-025 — "Criar workflow GitHub Actions com deploy no GitHub Pages"
  critérios/refs: AC-030 (Workflow existe com trigger agendado e manual), AC-031 (Workflow faz commit dos JSONs gerados sem falhar se nada mudou), AC-032 (Workflow publica no GitHub Pages após atualização)
  arquivos permitidos (e seus testes): .github/workflows/atualizar-dados.yml
  mensagem de commit: "T-025 site-estatico-github-pages: Criar workflow GitHub Actions com deploy no GitHub Pages"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `dotnet test Backend/Api.Tests --logger:trx && node --experimental-strip-types --test --test-reporter=tap Frontend/test/**/*.spec.test.ts` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-4

```
Você executa as tarefas da faixa-4 da feature "site-estatico-github-pages" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-4 (branch spec/site-estatico-github-pages-faixa-4) — já preparado.
Leia primeiro: .spec/features/site-estatico-github-pages/spec.md, .spec/features/site-estatico-github-pages/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-026 — "Criar script Playwright em TypeScript de download dos CSVs"
  critérios/refs: AC-033 (Script baixa os 3 CSVs do Portal da Transparência), AC-034 (Script falha com erro legível quando Portal está inacessível)
  arquivos permitidos (e seus testes): scripts/baixar-csvs.ts, scripts/package.json
  mensagem de commit: "T-026 site-estatico-github-pages: Criar script Playwright em TypeScript de download dos CSVs"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `dotnet test Backend/Api.Tests --logger:trx && node --experimental-strip-types --test --test-reporter=tap Frontend/test/**/*.spec.test.ts` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

3. **Todas terminaram? Mescle na ordem e marque as tarefas** (na árvore principal):

```bash
git merge --no-ff spec/site-estatico-github-pages-faixa-1 -m "merge faixa-1 (site-estatico-github-pages)"
git worktree remove ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-1 && git branch -d spec/site-estatico-github-pages-faixa-1
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa site-estatico-github-pages T-023 concluida
git merge --no-ff spec/site-estatico-github-pages-faixa-2 -m "merge faixa-2 (site-estatico-github-pages)"
git worktree remove ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-2 && git branch -d spec/site-estatico-github-pages-faixa-2
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa site-estatico-github-pages T-024 concluida
git merge --no-ff spec/site-estatico-github-pages-faixa-3 -m "merge faixa-3 (site-estatico-github-pages)"
git worktree remove ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-3 && git branch -d spec/site-estatico-github-pages-faixa-3
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa site-estatico-github-pages T-025 concluida
git merge --no-ff spec/site-estatico-github-pages-faixa-4 -m "merge faixa-4 (site-estatico-github-pages)"
git worktree remove ../onp-worktrees/sipo-if-site-estatico-github-pages-faixa-4 && git branch -d spec/site-estatico-github-pages-faixa-4
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa site-estatico-github-pages T-026 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs verify site-estatico-github-pages
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run sipo-if-site-estatico-github-pages-msrw66vf --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run sipo-if-site-estatico-github-pages-msrw66vf --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs resumo site-estatico-github-pages --tabela   # a tabela — cole no chat
node /home/felipe/.gemini/antigravity-cli/custom/skills/onp-spec-driven/scripts/onp-spec.mjs resumo site-estatico-github-pages --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

