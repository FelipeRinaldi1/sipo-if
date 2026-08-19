> feature: site-estatico-github-pages
> status: implementada

# Migração para Site Estático + GitHub Pages (Full TypeScript)

## Contexto

O SIPO-IF é um dashboard de visualização de dados orçamentários do IFSP. Os dados são somente
leitura, vêm de CSVs do Portal da Transparência e são atualizados periodicamente. Manter uma API
e banco PostgreSQL rodando 24/7 é desnecessário. Esta feature migra o projeto para uma arquitetura
**Full TypeScript** e sem servidor em produção: (1) scripts TypeScript (`scripts/gerar-dados.ts`)
que processam os CSVs gerando JSONs estáticos, e (2) um script TypeScript com Playwright (`scripts/baixar-csvs.ts`)
que automatiza o download dos CSVs — tudo orquestrado por GitHub Actions com Node 22 e servido via GitHub Pages.

## Histórias de usuário

### US-014 — Script TypeScript gera JSONs a partir dos CSVs

**Como** mantenedor do SIPO-IF,
**quero** rodar `node --experimental-strip-types scripts/gerar-dados.ts --ano 2025`
**para** gerar os arquivos JSON estáticos em `Frontend/src/assets/data/`
sem precisar subir banco nem API.

#### AC-023 — resumo-execucao.json gerado com estrutura correta

- **Dado** que existem CSVs em `downloads/2025/despesasPorOrgao.csv`
- **Quando** o script é executado com `--ano 2025`
- **Então** `Frontend/src/assets/data/resumo-execucao.json` é criado com as chaves `totalEmpenhado`, `totalLiquidado`, `totalPago`, `totalRestosAPagarPagos` e `evolucaoMensal` (array ordenado por mês/ano crescente)

#### AC-024 — programa-acao.json gerado com estrutura correta

- **Dado** que existem CSVs em `downloads/2025/despesasPorProgramaAcao.csv`
- **Quando** o script é executado com `--ano 2025`
- **Então** `Frontend/src/assets/data/programa-acao.json` é criado com as chaves `totalGeralEmpenhado`, `totalGeralPago`, `acoes` e `evolucaoAssistenciaMensal`

#### AC-025 — fornecedores.json gerado com estrutura correta

- **Dado** que existem CSVs em `downloads/2025/documentos.csv`
- **Quando** o script é executado com `--ano 2025`
- **Então** `Frontend/src/assets/data/fornecedores.json` é criado com as chaves `totalGeral`, `topFornecedores` (top 5 por valor pago) e `elementosDespesa`

#### AC-026 — Script retorna erro claro quando CSV não existe

- **Dado** que o CSV `downloads/2025/despesasPorOrgao.csv` não existe
- **Quando** o script é executado com `--ano 2025`
- **Então** o processo termina com exit code diferente de 0 e imprime mensagem de erro legível indicando qual arquivo está faltando

### US-015 — Frontend lê JSONs locais em vez de chamar a API

**Como** usuário do dashboard,
**quero** acessar o SIPO-IF hospedado no GitHub Pages
**para** visualizar os dados sem depender de nenhum servidor externo.

#### AC-027 — DespesasService aponta para assets locais (resumo-execucao)

- **Dado** que o Angular é buildado com `ng build`
- **Quando** o serviço `DespesasService` chama `getResumoExecucao()`
- **Então** a requisição é feita para `assets/data/resumo-execucao.json` e não para nenhuma URL de API (`localhost` ou domínio externo)

#### AC-028 — DespesasService aponta para assets locais (programa-acao e fornecedores)

- **Dado** que o Angular é buildado com `ng build`
- **Quando** os métodos `getResumoProgramaAcao()` e `getResumoFornecedores()` são chamados
- **Então** as requisições são feitas para `assets/data/programa-acao.json` e `assets/data/fornecedores.json` respectivamente

#### AC-029 — Documentos paginados servidos por JSON local com paginação no cliente

- **Dado** que `Frontend/src/assets/data/documentos.json` existe (gerado pelo script)
- **Quando** o dashboard carrega a listagem de documentos
- **Então** os dados são lidos de `assets/data/documentos.json` e a paginação é feita no lado do cliente sem parâmetros de query para servidor

### US-016 — GitHub Actions atualiza e publica automaticamente

**Como** mantenedor do SIPO-IF,
**quero** que o workflow do GitHub Actions rode periodicamente
**para** baixar os novos CSVs, regenerar os JSONs e publicar o site no GitHub Pages sem intervenção manual.

#### AC-030 — Workflow existe com trigger agendado e manual

- **Dado** o arquivo `.github/workflows/atualizar-dados.yml`
- **Quando** inspecionado
- **Então** contém `schedule` com cron configurado e `workflow_dispatch` para acionamento manual via botão no GitHub

#### AC-031 — Workflow faz commit dos JSONs gerados sem falhar se nada mudou

- **Dado** que o workflow rodou e o script gerou novos JSONs
- **Quando** os arquivos em `Frontend/src/assets/data/` são modificados
- **Então** o workflow faz `git commit` com mensagem no formato `dados: atualização MM/YYYY` e `git push` para a branch principal sem falhar quando nada mudou

#### AC-032 — Workflow publica no GitHub Pages após atualização

- **Dado** que o workflow fez commit dos JSONs e buildou o Angular com `ng build`
- **Quando** o build termina com sucesso
- **Então** o workflow faz deploy via `actions/deploy-pages` para o GitHub Pages sem erro

### US-017 — Script Playwright faz download automático dos CSVs

**Como** mantenedor do SIPO-IF,
**quero** que o GitHub Actions execute `node --experimental-strip-types scripts/baixar-csvs.ts --ano 2025` automaticamente
**para** obter os CSVs atualizados do Portal da Transparência sem acesso manual ao site.

#### AC-033 — Script baixa os 3 CSVs do Portal da Transparência

- **Dado** que o Portal da Transparência está acessível
- **Quando** `node --experimental-strip-types scripts/baixar-csvs.ts --ano 2025` é executado
- **Então** os arquivos `downloads/2025/despesasPorOrgao.csv`, `downloads/2025/despesasPorProgramaAcao.csv` e `downloads/2025/documentos.csv` são criados ou atualizados

#### AC-034 — Script falha com erro legível quando Portal está inacessível

- **Dado** que o Portal da Transparência retorna erro (timeout ou HTTP 5xx)
- **Quando** `node --experimental-strip-types scripts/baixar-csvs.ts --ano 2025` é executado
- **Então** o processo termina com exit code diferente de 0 e imprime mensagem de erro descritiva (sem stack trace bruto)

## Suposições

- ASM-001 [confirmada]: Os CSVs em `downloads/2025/` possuem cabeçalhos e formatos parseáveis via TypeScript nativo / streams.
- ASM-002 [confirmada]: A paginação de documentos no frontend é feita no cliente em TypeScript/RxJS com o JSON completo.
- ASM-003 [confirmada]: O repositório é configurado para GitHub Pages e GitHub Actions com Node 22.
- ASM-004 [confirmada]: O Angular compila de forma autônoma sem requisições para backend externo.

## Perguntas em aberto

- Q-001 [confirmada]: O script de download usa Playwright e TypeScript.
- Q-002 [confirmada]: Deploy via GitHub Pages usando `actions/deploy-pages`.
- Q-003 [confirmada]: Toda a automação e scripts são 100% TypeScript executados em Node 22+.
