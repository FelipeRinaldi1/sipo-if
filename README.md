# Template de Minimal API

### Estrutura de Pastas:

```bash
Backend/
│
├── Data/                       # Infraestrutura global e compartilhada de banco
│   ├── Migrations/             # Migrações do Entity Framework
│   ├── DataExtensions.cs       # Métodos de inicialização e Auto-Migration
│   └── TemplateContext.cs      # DbContext principal
│
├── Extensions/                 # Extensões globais do WebApplication
│   ├── AppExtensions.cs        # Mapeamento de rotas e middlewares
│   └── BuilderExtensions.cs    # Registro de serviços do Builder
│
├── Features/                   # Pasta raiz de funcionalidades do negócio
│   └── Items/                  # Exemplo de Feature Genérica: Items
│       ├── Item.cs             # Entidade/Modelo de domínio
│       ├── ItemConfiguration.cs # Mapeamento EF específico da entidade Item
│       ├── ItemContracts.cs    # DTOs de entrada e saída
│       └── ItemEndpoints.cs    # Definição e lógica dos endpoints
│
├── Program.cs                  # Ponto de entrada do aplicativo
├── Template.csproj             # Arquivo de configuração do projeto .NET
├── Dockerfile                  # Dockerfile para build do container
└── template.http               # Arquivo HTTP Client para teste rápido das rotas
```

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download) instalado localmente.
- [Docker](https://www.docker.com/) e Docker Compose.

### Passo 1: Configuração do Ambiente (.env)

Copie o arquivo `.env.example` na raiz do projeto para `.env` e configure as credenciais desejadas:

```bash
cp .env.example .env
```

### Passo 2: Subir a Infraestrutura com Docker Compose

Para rodar a aplicação inteira:

```bash
docker compose up --build -d
```

A API estará exposta na porta `5000`.

#### Caso queira rodar o Backend localmente (`dotnet run`) e apenas o banco no Docker:

1. Altere o `docker-compose.yml` ou simplesmente execute apenas o serviço de banco:
    ```bash
    docker compose up postgres-db -d
    ```
2. Restaure e execute o projeto do backend local:
    ```bash
    cd Backend
    dotnet run
    ```
    \_Nota: A aplicação aplica automaticamente quaisquer migrations pendentes na inicialização

---

## 🧪 Testando as Rotas

Você pode testar as rotas da API usando o arquivo [template.http](file:///home/felipe/Projects/novo-projeto/Backend/template.http). Ele contém chamadas pré-configuradas para o CRUD de itens (`GET`, `POST`, `PUT`, `DELETE`).

Caso use o VS Code, basta ter a extensão **REST Client** instalada para enviar as requisições diretamente do arquivo.

---

## ➕ Como Adicionar uma Nova Feature?

Para adicionar um novo recurso (por exemplo, `Users` ou `Products`), siga estes passos simples:

1. Crie uma pasta sob `/Features/NomeDaFeature` (ex: `Backend/Features/Users`).
2. Adicione sua Entidade (ex: `User.cs`).
3. (Opcional) Crie o mapeamento do banco de dados criando uma classe herdando de `IEntityTypeConfiguration<User>` (ex: `UserConfiguration.cs`). O `DbContext` irá detectá-la automaticamente.
4. Adicione os DTOs em `UserContracts.cs`.
5. Crie as rotas e injete o `TemplateContext` diretamente no endpoint em `UserEndpoints.cs`.
6. Mapeie a rota em `AppExtensions.cs`
7. Crie uma nova Migration rodando:
    ```bash
    dotnet ef migrations add AddUserFeature -p Backend/
    ```
8. Execute a aplicação (ver instruções acima).
