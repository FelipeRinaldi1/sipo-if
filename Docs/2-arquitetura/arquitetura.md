# Arquitetura do Template

Este documento descreve os níveis do projeto **Template**.

---

## 1. Nível 1: Contexto de Sistema

Abaixo está a representação de contexto mostrando como os usuários interagem com o sistema.

```mermaid
graph TD
    user[Usuário<br>Usuário final do sistema]
    template[Template<br>Sistema base de exemplo]

    user -->|Interage com| template
```

---

## 2. Nível 2: Contêineres

Detalhamento tecnológico dos contêineres que formam o ecossistema do **Template**.

```mermaid
graph TD
    subgraph Sistema Template
        web_app[Aplicativo Web<br>Angular]
        api[Web API Backend<br>.NET 10 Minimal API]
        db[(Banco de Dados<br>PostgreSQL)]
    end

    user[Usuário] -->|Interage com o painel| web_app
    web_app -->|Chamadas HTTP/JSON| api
    api -->|Entity Framework Core / Npgsql| db
```

---

## 3. Nível 3: Componentes

Detalhamento interno do contêiner da **API** com seus principais componentes.

```mermaid
graph TD
    web_app[Aplicativo Web Angular]
    db[(Banco de Dados PostgreSQL)]

    subgraph Web API Backend
        program[Program.cs<br>Ponto de entrada]
        builder_ext[BuilderExtensions<br>Configuração de dependências/DbContext]
        app_ext[AppExtensions<br>Configuração de middlewares e rotas]
        endpoints[Feature Endpoints<br>Ex: ItemEndpoints]
        context[TemplateContext<br>EF Core DbContext]
    end

    web_app -->|Requisições HTTP| app_ext
    program -->|Chama| builder_ext
    program -->|Chama| app_ext
    app_ext -->|Mapeia/Roteia para| endpoints
    endpoints -->|Usa| context
    context -->|Lê e Grava dados| db
```
