# Plano de execução — sincronizacao-transparencia

> gerado por `onp-spec plano` em 2026-08-09 18:30 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano sincronizacao-transparencia`

## Resumo — o que vai acontecer

- **5 tarefa(s) pendente(s)**: 5 em 4 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano sincronizacao-transparencia --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/sincronizacao-transparencia`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1 ∥ faixa-2 ∥ faixa-3

#### faixa-1 — branch `spec/sincronizacao-transparencia-faixa-1` — worktree `../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-001 | Entidade DespesaOrcamentaria e migration | `claude-sonnet-5` | medium | `Backend/Features/Transparencia/DespesaOrcamentaria.cs`, `Backend/Data/TemplateContext.cs`, `Backend/Data/Migrations` |

#### faixa-2 — branch `spec/sincronizacao-transparencia-faixa-2` — worktree `../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-2`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-002 | Cliente HTTP para API do Portal da Transparência | `claude-sonnet-5` | medium | `Backend/Features/Transparencia/TransparenciaApiClient.cs`, `Backend/Extensions/BuilderExtensions.cs` |
| T-003 | Job de sincronização agendada (IHostedService) | `claude-sonnet-5` | high | `Backend/Features/Transparencia/SincronizacaoJob.cs`, `Backend/Features/Transparencia/SincronizacaoLog.cs`, `Backend/Extensions/BuilderExtensions.cs` |

#### faixa-3 — branch `spec/sincronizacao-transparencia-faixa-3` — worktree `../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-3`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-004 | Endpoint GET /sincronizacao/status | `claude-sonnet-5` | low | `Backend/Features/Transparencia/TransparenciaEndpoints.cs`, `Backend/Extensions/AppExtensions.cs` |

### Onda 2 — faixa-4

#### faixa-4 — branch `spec/sincronizacao-transparencia-faixa-4` — worktree `../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-4`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-005 | Testes de integração da sincronização | `claude-sonnet-5` | high | `Backend/Tests/Transparencia/SincronizacaoTests.cs` |

## Gestão de branches e commits

1. branch de trabalho `spec/sincronizacao-transparencia` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify sincronizacao-transparencia` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/sincronizacao-transparencia   # ou: git checkout spec/sincronizacao-transparencia
git worktree add ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-1 -b spec/sincronizacao-transparencia-faixa-1
git worktree add ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-2 -b spec/sincronizacao-transparencia-faixa-2
git worktree add ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-3 -b spec/sincronizacao-transparencia-faixa-3
git worktree add ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-4 -b spec/sincronizacao-transparencia-faixa-4
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "sincronizacao-transparencia" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-1 (branch spec/sincronizacao-transparencia-faixa-1) — já preparado.
Leia primeiro: .spec/features/sincronizacao-transparencia/spec.md, .spec/features/sincronizacao-transparencia/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-001 — "Entidade DespesaOrcamentaria e migration"
  critérios/refs: AC-001 (Dados de despesas são persistidos no banco após sincronização), AC-002 (Sincronização não duplica registros existentes)
  arquivos permitidos (e seus testes): Backend/Features/Transparencia/DespesaOrcamentaria.cs, Backend/Data/TemplateContext.cs, Backend/Data/Migrations
  mensagem de commit: "T-001 sincronizacao-transparencia: Entidade DespesaOrcamentaria e migration"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `cd Frontend && npm test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-2

```
Você executa as tarefas da faixa-2 da feature "sincronizacao-transparencia" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-2 (branch spec/sincronizacao-transparencia-faixa-2) — já preparado.
Leia primeiro: .spec/features/sincronizacao-transparencia/spec.md, .spec/features/sincronizacao-transparencia/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-002 — "Cliente HTTP para API do Portal da Transparência"
  critérios/refs: AC-001 (Dados de despesas são persistidos no banco após sincronização), AC-003 (Falha na API governamental não derruba o sistema)
  arquivos permitidos (e seus testes): Backend/Features/Transparencia/TransparenciaApiClient.cs, Backend/Extensions/BuilderExtensions.cs
  mensagem de commit: "T-002 sincronizacao-transparencia: Cliente HTTP para API do Portal da Transparência"
T-003 — "Job de sincronização agendada (IHostedService)"
  critérios/refs: AC-001 (Dados de despesas são persistidos no banco após sincronização), AC-002 (Sincronização não duplica registros existentes), AC-003 (Falha na API governamental não derruba o sistema)
  arquivos permitidos (e seus testes): Backend/Features/Transparencia/SincronizacaoJob.cs, Backend/Features/Transparencia/SincronizacaoLog.cs, Backend/Extensions/BuilderExtensions.cs
  mensagem de commit: "T-003 sincronizacao-transparencia: Job de sincronização agendada (IHostedService)"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `cd Frontend && npm test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-3

```
Você executa as tarefas da faixa-3 da feature "sincronizacao-transparencia" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-3 (branch spec/sincronizacao-transparencia-faixa-3) — já preparado.
Leia primeiro: .spec/features/sincronizacao-transparencia/spec.md, .spec/features/sincronizacao-transparencia/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-004 — "Endpoint GET /sincronizacao/status"
  critérios/refs: AC-004 (Registro de data/hora da última sincronização bem-sucedida), AC-005 (Registro de falha de sincronização)
  arquivos permitidos (e seus testes): Backend/Features/Transparencia/TransparenciaEndpoints.cs, Backend/Extensions/AppExtensions.cs
  mensagem de commit: "T-004 sincronizacao-transparencia: Endpoint GET /sincronizacao/status"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `cd Frontend && npm test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

#### Prompt — faixa-4

```
Você executa as tarefas da faixa-4 da feature "sincronizacao-transparencia" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-4 (branch spec/sincronizacao-transparencia-faixa-4) — já preparado.
Leia primeiro: .spec/features/sincronizacao-transparencia/spec.md, .spec/features/sincronizacao-transparencia/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-005 — "Testes de integração da sincronização"
  critérios/refs: AC-001 (Dados de despesas são persistidos no banco após sincronização), AC-002 (Sincronização não duplica registros existentes), AC-003 (Falha na API governamental não derruba o sistema), AC-004 (Registro de data/hora da última sincronização bem-sucedida), AC-005 (Registro de falha de sincronização)
  arquivos permitidos (e seus testes): Backend/Tests/Transparencia/SincronizacaoTests.cs
  mensagem de commit: "T-005 sincronizacao-transparencia: Testes de integração da sincronização"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `cd Frontend && npm test` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.
Quando a última tarefa estiver commitada, PARE e informe o resultado — a mesclagem é do orquestrador.
```

3. **Todas terminaram? Mescle na ordem e marque as tarefas** (na árvore principal):

```bash
git merge --no-ff spec/sincronizacao-transparencia-faixa-1 -m "merge faixa-1 (sincronizacao-transparencia)"
git worktree remove ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-1 && git branch -d spec/sincronizacao-transparencia-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa sincronizacao-transparencia T-001 concluida
git merge --no-ff spec/sincronizacao-transparencia-faixa-2 -m "merge faixa-2 (sincronizacao-transparencia)"
git worktree remove ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-2 && git branch -d spec/sincronizacao-transparencia-faixa-2
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa sincronizacao-transparencia T-002 concluida
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa sincronizacao-transparencia T-003 concluida
git merge --no-ff spec/sincronizacao-transparencia-faixa-3 -m "merge faixa-3 (sincronizacao-transparencia)"
git worktree remove ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-3 && git branch -d spec/sincronizacao-transparencia-faixa-3
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa sincronizacao-transparencia T-004 concluida
git merge --no-ff spec/sincronizacao-transparencia-faixa-4 -m "merge faixa-4 (sincronizacao-transparencia)"
git worktree remove ../onp-worktrees/sipo-if-sincronizacao-transparencia-faixa-4 && git branch -d spec/sincronizacao-transparencia-faixa-4
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa sincronizacao-transparencia T-005 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify sincronizacao-transparencia
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run sipo-if-sincronizacao-transparencia-msm51kcx --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run sipo-if-sincronizacao-transparencia-msm51kcx --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo sincronizacao-transparencia --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo sincronizacao-transparencia --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

