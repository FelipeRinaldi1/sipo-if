# Constituição — sipo-if

<!--
  Princípios inegociáveis do projeto. Não são estilo: são restrições.
  P-xxx = princípio (código de rastreio, como US/AC/T).
  Níveis: [DEVE] obrigatório · [RECOMENDADO] forte · [PODE] permitido/explícito.
  Todo [DEVE] precisa de verificação executável — senão o audit acusa
  "princípio sem verificação" (PRINCIPIO_SEM_VERIFICACAO). Formatos:
    - verificação(gate): satisfeita pelo próprio audit (só p/ princípios "meta")
    - verificação(teste): @principle:P-xxx
    - verificação(proibido): `regex` em `glob`
    - verificação(obrigatório): `regex` em `glob`
-->

## Visão Geral do Projeto

**sipo-if** é uma aplicação estática (Jamstack) **Full TypeScript** para visualização e transparência de dados orçamentários do IFSP:

- **Frontend**: SPA em **Angular 22** com Angular Material e Tailwind CSS v4, servida via **GitHub Pages**.
- **Automação e Scripts**: Scripts em **TypeScript** (Node.js 22) para agregação de dados CSV e geração dos JSONs estáticos.
- **CI/CD**: **GitHub Actions** para atualização periódica dos dados e deploy contínuo no GitHub Pages.

---

## Stack Técnica

### Frontend
- Framework: `Angular 22`
- Componentes UI: `Angular Material`
- Estilização: `Tailwind CSS v4` + SCSS
- Formatação de código: `Prettier` (printWidth: 100, singleQuote: true)
- Testes: `Vitest` / `Node Test Runner`
- Node: `22.22.3` / npm: `11.16.0`

### Scripts & Automação
- Runtime: `Node.js 22` com suporte nativo a TypeScript (`--experimental-strip-types`)
- Automação de Browser: `Playwright`

---

## Arquitetura

### Frontend — Feature-based Architecture
Funcionalidades ficam em `Frontend/src/app/features/<nome-da-feature>/`.
Código reutilizável e transversal fica em:
- `core/` — interceptors, serviços singleton (ex: `DespesasService` consumindo dados de `assets/data/`)
- `shared/` — componentes, pipes e diretivas compartilhados

---

## P-001 [DEVE] Todo requisito tem prova executável

Nenhuma feature é declarada pronta sem o audit em modo CI sair limpo (exit 0).
Este princípio é verificado pelo próprio mecanismo do audit (AC_SEM_TESTE,
AC_SEM_PROVA, TASK_CONCLUIDA_SEM_PROVA) — não precisa de teste extra seu.

- verificação(gate): intrínseca ao audit

---

## P-002 [DEVE] Segredos nunca em código

Chaves, senhas e tokens nunca devem ser hard-coded no repositório.

- verificação(proibido): `(apiKey|password|senha|secret)\s*[:=]\s*['"][^'"]{8,}` em `Frontend/src/**/*.ts`
- verificação(proibido): `(apiKey|password|senha|secret)\s*[:=]\s*['"][^'"]{8,}` em `scripts/**/*.ts`

---

## P-008 [DEVE] Frontend: features isoladas em seu próprio diretório

Cada funcionalidade de frontend [DEVE] residir em `Frontend/src/app/features/<nome>/`.
Nenhum componente de feature específica deve ser criado diretamente em `app/`.

- verificação(obrigatório): `Component\(` em `Frontend/src/app/features/**/*.ts`

---

## P-009 [RECOMENDADO] Prettier aplicado ao código TypeScript/HTML

Todo arquivo `.ts` e `.html` do frontend [DEVE] ser formatado com Prettier
(printWidth: 100, singleQuote: true, parser angular para HTML) antes do commit.

- verificação(obrigatório): `"singleQuote": true` em `Frontend/.prettierrc`

---

## Convenções de Nomenclatura

### Frontend (Angular/TypeScript) & Scripts
- Componentes: `kebab-case` no seletor, `PascalCase` na classe (ex: `app-login`, `LoginComponent`)
- Serviços: `PascalCase` + sufixo `Service` (ex: `DespesasService`)
- Arquivos: `kebab-case` (ex: `despesas.service.ts`, `gerar-dados.ts`)
- Variáveis e funções: `camelCase`
- Interfaces de modelo: `PascalCase` sem prefixo `I`

---

## LGPD (Lei Geral de Proteção de Dados)

## P-014 [DEVE] Dados pessoais nunca em log

CPF, e-mail, nome completo, matrícula e outros dados pessoais não podem aparecer
em chamadas de log.

- verificação(proibido): `console\.(log|warn|error|info)\(.*\b(cpf|email|matricula|senha|password)\b` em `Frontend/src/**/*.ts`

---

## P-018 [DEVE] Frontend: Tailwind apenas para Layout; Angular Material para Componentes e Estilo

No Frontend Angular:
1. **Tailwind CSS** deve ser utilizado EXCLUSIVAMENTE para controle de layout, posicionamento e espaçamento (`flex`, `grid`, `gap`, `p-`, `m-`, `w-`, `h-`).
2. **Angular Material** deve ser utilizado para TODOS os componentes visuais, cartões, tabelas, botões, formulários, modais, tooltips e paleta de cores.
3. É PROIBIDA a criação de regras CSS/SCSS customizadas a mão para estilizar componentes ou cores.

- verificação(obrigatório): `import.*@angular/material` em `Frontend/src/app/**/*.ts`

---

## P-019 [DEVE] Frontend: Design e Desenvolvimento Mobile-First

Todo layout, componente, gráfico e tabela no Frontend [DEVE] adotar a abordagem **Mobile-First**:
1. **Layout Base para Telas Pequenas**: As classes CSS/Tailwind base aplicam-se a telas móveis (320px - 640px), utilizando modificadores progressivos (`sm:`, `md:`, `lg:`, `xl:`) apenas para expandir layouts em viewports maiores.
2. **Gráficos e Tabelas Responsivos**: Gráficos ApexCharts devem definir breakpoints responsivos com redimensionamento de fontes/legendas para mobile; tabelas devem dispor de rolagem horizontal fluida (`overflow-x-auto`) ou ocultação seletiva de colunas secundárias.
3. **Áreas de Toque e Ergonomia**: Botões, inputs e chips interativos devem atender a alvos de toque confortáveis (mínimo 44px de altura ou padding de toque adequado) e espaçamento mínimo contra cliques acidentais.

- verificação(obrigatório): `(sm:|md:|lg:|responsive)` em `Frontend/src/app/**/*.html`

---

## Comandos Chave

```bash
# Executar a aplicação (gera dados e abre o browser)
npm start

# Gerar JSONs estáticos a partir dos CSVs
npm run gerar-dados

# Baixar CSVs com Playwright
npm run baixar-csvs

# Testes de especificação
npm run test:spec
```
