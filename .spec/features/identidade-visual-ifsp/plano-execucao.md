# Plano de execução — identidade-visual-ifsp

> gerado por `onp-spec plano` em 2026-08-12 18:34 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano identidade-visual-ifsp`

## Resumo — o que vai acontecer

- **1 tarefa(s) pendente(s)**: 1 em 1 faixa(s) paralela(s) + 0 sequencial(is)
- **1 faixa = 1 worktree + 1 branch + 1 janela de contexto limpa** — faixas não compartilham nenhum arquivo entre si
- prefere outra seleção ou uma após a outra? Regenere com `onp-spec plano identidade-visual-ifsp --paralelizar T-xxx,T-yyy` ou `--sequencial`
- tudo acontece na branch de trabalho `spec/identidade-visual-ifsp`; levar para a main é decisão sua

## Faixas e ondas

### Onda 1 — faixa-1

#### faixa-1 — branch `spec/identidade-visual-ifsp-faixa-1` — worktree `../onp-worktrees/sipo-if-identidade-visual-ifsp-faixa-1`

| tarefa | título | modelo | esforço | arquivos |
|---|---|---|---|---|
| T-016 | Implementar Tema de Cores do IFSP no Frontend | `claude-sonnet-5` | medium | `Frontend/src/styles.scss`, `Frontend/src/tailwind.css`, `Frontend/src/app/app.html`, `Frontend/src/app/features/**/*.ts`, `Frontend/src/app/features/**/*.html` |

## Gestão de branches e commits

1. branch de trabalho `spec/identidade-visual-ifsp` criada do ponto atual (se ainda não existir)
2. cada faixa nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)
3. terminou a onda → merge `--no-ff` de cada faixa de volta, na ordem; conflito interrompe a faixa e pede resolução humana
4. faixa mesclada → worktree removido, branch apagada, tarefa marcada `[concluida]` no tasks.md
5. gate final na branch de trabalho: `onp-spec verify identidade-visual-ifsp` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Paralelo nativo no Antigravity (janelas limpas, sem Claude CLI)

1. **Prepare a branch de trabalho e os worktrees** (terminal, na raiz do repositório):

```bash
git checkout -b spec/identidade-visual-ifsp   # ou: git checkout spec/identidade-visual-ifsp
git worktree add ../onp-worktrees/sipo-if-identidade-visual-ifsp-faixa-1 -b spec/identidade-visual-ifsp-faixa-1
```

2. **Abra um agente NOVO por faixa** (janela limpa) e cole o prompt da faixa:

#### Prompt — faixa-1

```
Você executa as tarefas da faixa-1 da feature "identidade-visual-ifsp" (fluxo onp-spec, spec-anchored).
Trabalhe SOMENTE dentro do worktree ../onp-worktrees/sipo-if-identidade-visual-ifsp-faixa-1 (branch spec/identidade-visual-ifsp-faixa-1) — já preparado.
Leia primeiro: .spec/features/identidade-visual-ifsp/spec.md, .spec/features/identidade-visual-ifsp/tasks.md e .spec/constituicao.md.

Execute NESTA ORDEM (1 tarefa = 1 commit):
T-016 — "Implementar Tema de Cores do IFSP no Frontend"
  critérios/refs: AC-016 (Aplicação do Tema Institucional Verde e Vermelho do IFSP)
  arquivos permitidos (e seus testes): Frontend/src/styles.scss, Frontend/src/tailwind.css, Frontend/src/app/app.html, Frontend/src/app/features/**/*.ts, Frontend/src/app/features/**/*.html
  mensagem de commit: "T-016 identidade-visual-ifsp: Implementar Tema de Cores do IFSP no Frontend"

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
git merge --no-ff spec/identidade-visual-ifsp-faixa-1 -m "merge faixa-1 (identidade-visual-ifsp)"
git worktree remove ../onp-worktrees/sipo-if-identidade-visual-ifsp-faixa-1 && git branch -d spec/identidade-visual-ifsp-faixa-1
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs tarefa identidade-visual-ifsp T-016 concluida
```

5. **Gate final** (exit 0 ou não está pronto):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs verify identidade-visual-ifsp
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs audit --ci
```

6. **Acompanhamento (a cada ~1 min, enquanto os agentes trabalham)**: avise ANTES
   de despachar os agentes que o trabalho roda em background e que o resumo
   completo vem ao final. Marque cada tarefa no ledger quando um agente começa
   e quando termina (é disso que a tabela é feita):

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run sipo-if-identidade-visual-ifsp-msqfhpo0 --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado executando
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs evento --run sipo-if-identidade-visual-ifsp-msqfhpo0 --tipo tarefa --tarefa <T-xxx> --faixa <faixa-N> --estado concluida
```

   E a cada ~1 min poste no chat a TABELA de andamento + um parágrafo curto,
   registrando o texto no ledger:

```bash
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo identidade-visual-ifsp --tabela   # a tabela — cole no chat
node .agents/skills/onp-spec-driven/scripts/onp-spec.mjs resumo identidade-visual-ifsp --gravar --origem ia --texto "<2 a 4 frases do que está rolando>"
```

