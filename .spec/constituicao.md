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

**sipo-if** é uma aplicação fullstack organizada em monorepo com:

- **Backend**: API REST em **C# / .NET 10** com Minimal APIs, Entity Framework Core e PostgreSQL.
- **Frontend**: SPA em **Angular 22** com Angular Material e Tailwind CSS v4.
- **Infraestrutura**: Docker Compose para orquestração local de todos os serviços.

---

## Stack Técnica

### Backend
- Runtime: `.NET 10`
- Banco de dados: `PostgreSQL` via `Npgsql.EntityFrameworkCore.PostgreSQL`
- ORM: `Entity Framework Core` (code-first com migrations)
- Documentação da API: `Scalar` (OpenAPI)
- Autenticação: `ASP.NET Core Identity` + JWT (`System.IdentityModel.Tokens.Jwt`)
- Testes HTTP rápidos: arquivos `.http` (extensão REST Client do VS Code)

### Frontend
- Framework: `Angular 22`
- Componentes UI: `Angular Material`
- Estilização: `Tailwind CSS v4` + SCSS
- Formatação de código: `Prettier` (printWidth: 100, singleQuote: true)
- Testes: `Vitest`
- Node: `22.22.3` / npm: `11.16.0`

---

## Arquitetura

### Backend — Vertical Slice Architecture
Cada módulo de negócio é uma "fatia vertical" dentro de `Backend/Features/<NomeDoModulo>/`, contendo:

| Arquivo | Responsabilidade |
|---|---|
| `<Modulo>.cs` | Entidade de domínio (classe C#, mapeada para tabela via `[Table]`) |
| `<Modulo>Contracts.cs` | DTOs (`record`) de entrada e saída |
| `<Modulo>Endpoints.cs` | Definição e lógica das rotas Minimal API |

Infraestrutura compartilhada fica em `Backend/Data/` (DbContext, migrations) e `Backend/Extensions/` (registro de serviços e middlewares).

### Frontend — Feature-based Architecture
Funcionalidades ficam em `Frontend/src/app/features/<nome-da-feature>/`.
Código reutilizável e transversal fica em:
- `core/` — interceptors, serviços singleton
- `shared/` — componentes, pipes e diretivas compartilhados

---

## P-001 [DEVE] Todo requisito tem prova executável

Nenhuma feature é declarada pronta sem o audit em modo CI sair limpo (exit 0).
Este princípio é verificado pelo próprio mecanismo do audit (AC_SEM_TESTE,
AC_SEM_PROVA, TASK_CONCLUIDA_SEM_PROVA) — não precisa de teste extra seu.

- verificação(gate): intrínseca ao audit

---

## P-002 [DEVE] Segredos nunca em código

Chaves, senhas e connection strings vêm exclusivamente de variáveis de ambiente
(via `.env` / `appsettings.json` com valores de env), nunca hard-coded no repositório.

- verificação(proibido): `(api[_-]?key|password|senha|secret)\s*[:=]\s*['"][^'"]{8,}` em `Backend/**/*.cs`
- verificação(proibido): `(apiKey|password|senha|secret)\s*[:=]\s*['"][^'"]{8,}` em `Frontend/src/**/*.ts`

---

## P-003 [DEVE] Nova feature backend segue o padrão Vertical Slice

Toda nova funcionalidade de backend [DEVE] ser criada como uma fatia vertical em
`Backend/Features/<NomeDoModulo>/`, contendo obrigatoriamente:
1. Entidade/modelo em `<Modulo>.cs`
2. DTOs em `<Modulo>Contracts.cs`
3. Endpoints em `<Modulo>Endpoints.cs`
4. Migration criada via `dotnet ef migrations add <Nome> -p Backend/`

- verificação(obrigatório): `MapGroup\(` em `Backend/Features/**/*Endpoints.cs`

---

## P-004 [DEVE] Entidades usam Guid como chave primária e DateTime UTC

Toda entidade de domínio [DEVE] ter:
- `Id` do tipo `Guid` inicializado com `Guid.NewGuid()`
- Timestamps usando `DateTime.UtcNow`

- verificação(obrigatório): `Guid Id \{ get; set; \} = Guid\.NewGuid\(\)` em `Backend/Features/**/*.cs`

---

## P-005 [DEVE] DTOs são records C#, não classes

Contratos de entrada e saída [DEVEM] ser definidos como `record` (imutáveis por padrão),
não como `class`.

- verificação(proibido): `^public class (Create|Update|Get|List|Delete)[A-Z][a-zA-Z]*Dto` em `Backend/Features/**/*Contracts.cs`

---

## P-006 [DEVE] Endpoints tipados com TypedResults

Respostas de endpoints Minimal API [DEVEM] usar `TypedResults` (e não `Results.Ok`, `Results.NotFound` avulso)
para garantir que o OpenAPI reflita os tipos de retorno corretamente.

- verificação(obrigatório): `TypedResults\.` em `Backend/Features/**/*Endpoints.cs`

---

## P-007 [RECOMENDADO] Queries de leitura usam AsNoTracking

Consultas que apenas retornam dados (GET) [DEVEM] encadear `.AsNoTracking()` para
evitar overhead desnecessário de rastreamento do EF Core.

- verificação(obrigatório): `AsNoTracking\(\)` em `Backend/Features/**/*Endpoints.cs`

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

## P-010 [DEVE] Migrations nunca editadas manualmente

Arquivos em `Backend/Data/Migrations/` são gerados exclusivamente pelo EF Core
(`dotnet ef migrations add`). Edição manual é proibida.

- verificação(proibido): `\/\/ MANUAL` em `Backend/Data/Migrations/**/*.cs`

---

## Convenções de Nomenclatura

### Backend (C#)
- Namespaces: `Template.Features.<NomeDoModulo>`
- Classes/Records/Interfaces: `PascalCase`
- Métodos e propriedades: `PascalCase`
- Variáveis locais e parâmetros: `camelCase`
- Constantes: `PascalCase` (ex: `GetItemRouteName`)

### Frontend (Angular/TypeScript)
- Componentes: `kebab-case` no seletor, `PascalCase` na classe (ex: `app-login`, `LoginComponent`)
- Serviços: `PascalCase` + sufixo `Service` (ex: `AuthService`)
- Arquivos: `kebab-case` (ex: `auth.service.ts`, `login.component.ts`)
- Variáveis e funções: `camelCase`
- Interfaces de modelo: `PascalCase` sem prefixo `I`

---

## LGPD (Lei Geral de Proteção de Dados)

> Princípios adaptados do preset `lgpd-educacao` para o contexto sipo-if
> (sistema que trata dados de alunos de Instituto Federal, incluindo menores de idade).

## P-011 [DEVE] Dados pessoais de alunos nunca expostos a outros alunos

Nenhum endpoint pode retornar dados pessoais de um aluno (nome completo, CPF, e-mail,
matrícula, notas) em uma resposta acessível por outro aluno autenticado.
Rotas que retornam dados de um titular específico devem verificar se o usuário
autenticado é o próprio titular ou um perfil autorizado (servidor/admin).

- verificação(teste): @principle:P-011

## P-012 [DEVE] Acesso a dados sensíveis gera trilha de auditoria

Qualquer leitura ou alteração de dado pessoal sensível (notas, CPF, dados de matrícula)
[DEVE] registrar quem acessou, quando e qual recurso — em tabela de auditoria
dedicada, não em log de aplicação.

- verificação(teste): @principle:P-012

## P-013 [DEVE] Dados de menores só com base legal explícita documentada

O sistema lida com alunos que podem ser menores de idade. Toda coleta de dado pessoal
de menor [DEVE] ter a base legal (ex: execução de contrato com a instituição, obrigação
legal) documentada nos comentários da entidade ou nos DTOs correspondentes.

- verificação(teste): @principle:P-013

## P-014 [DEVE] Dados pessoais nunca em log

CPF, e-mail, nome completo, matrícula e outros dados pessoais não podem aparecer
em chamadas de log (Console.Write, ILogger, etc.).

- verificação(proibido): `(ILogger|_logger|Console)\.[A-Za-z]+\(.*\b(cpf|email|matricula|senha|password)\b` em `Backend/**/*.cs`
- verificação(proibido): `console\.(log|warn|error|info)\(.*\b(cpf|email|matricula|senha|password)\b` em `Frontend/src/**/*.ts`

## P-015 [RECOMENDADO] Minimização de coleta

Só devem ser coletados os dados estritamente necessários para a finalidade da feature.
Campos opcionais nos DTOs devem ser justificados em comentário ou na spec.

## P-016 [DEVE] Exclusão lógica (soft delete) para dados de titulares

Dados pessoais de titulares não devem ser apagados fisicamente de imediato mediante
solicitação; deve existir um mecanismo de soft delete (campo `DeletedAt` ou `IsDeleted`)
para atender o prazo legal e manter integridade referencial.

- verificação(teste): @principle:P-016

## P-017 [PODE] Portabilidade dos dados do aluno

O sistema pode (e idealmente deve) oferecer endpoint que permita ao aluno exportar
seus próprios dados em formato estruturado (JSON/CSV), atendendo ao art. 18, V da LGPD.

## P-018 [DEVE] Frontend: Tailwind apenas para Layout; Angular Material para Componentes e Estilo

No Frontend Angular:
1. **Tailwind CSS** deve ser utilizado EXCLUSIVAMENTE para controle de layout, posicionamento e espaçamento (`flex`, `grid`, `gap`, `p-`, `m-`, `w-`, `h-`).
2. **Angular Material** deve ser utilizado para TODOS os componentes visuais, cartões, tabelas, botões, formulários, modais, tooltips e paleta de cores.
3. É PROIBIDA a criação de regras CSS/SCSS customizadas a mão para estilizar componentes ou cores.

- verificação(obrigatório): `import.*@angular/material` em `Frontend/src/app/**/*.ts`

## P-019 [DEVE] Backend TDD com xUnit

Todo comportamento de negócio do backend [DEVE] ser desenvolvido usando a prática de TDD (Test-Driven Development) com o framework **xUnit**, onde os testes nascem antes do código e são anotados com `@spec:AC-xxx`.

- verificação(obrigatório): `\[Fact\]|\[Theory\]` em `Backend.Tests/**/*.cs`

---

## Comandos Chave

```bash
# Rodar tudo via Docker
docker compose up --build -d

# Backend — desenvolvimento local
cd Backend && dotnet run

# Frontend — desenvolvimento local
cd Frontend && npm start

# Criar migration
dotnet ef migrations add <NomeDaMigration> -p Backend/

# Testes frontend
cd Frontend && npm test
```
