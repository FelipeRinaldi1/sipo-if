# Template - Backend API

Esta é a API do sistema **Template**, desenvolvida em C# utilizando .NET 10 e Entity Framework Core (com provedor PostgreSQL).

## 📁 Estrutura de Pastas

Este projeto é organizado utilizando o padrão de **Vertical Slice Architecture** (Fatias Verticais), agrupando cada funcionalidade de negócio dentro da pasta `/Features`.

```bash
.
├── Data/                       # Banco de dados e infraestrutura EF Core
│   ├── Migrations/             # Migrações do Entity Framework (PostgreSQL)
│   ├── DataExtensions.cs       # Inicialização do banco, seeding e auto-migration
│   └── TemplateContext.cs      # DbContext principal (com suporte a ASP.NET Core Identity)
│
├── Extensions/                 # Extensões globais do WebApplication
│   ├── AppExtensions.cs        # Mapeamento de middlewares, Swagger/Scalar e rotas
│   └── BuilderExtensions.cs    # Registro de serviços do builder (CORS, Identity, Db)
│
├── Features/                   # Pasta raiz de fatias verticais de negócio
│   ├── Items/                  # Módulo de Itens (exemplo CRUD)
│   │   ├── Item.cs             # Entidade/Modelo de domínio
│   │   ├── ItemContracts.cs    # DTOs de entrada e saída
│   │   └── ItemEndpoints.cs    # Definição e lógica de rotas REST
│   └── Users/                  # Módulo de Usuários (Autenticação/Identity)
│
├── Program.cs                  # Ponto de entrada do aplicativo
├── Template.csproj             # Configurações do projeto e pacotes NuGet
├── Dockerfile                  # Dockerfile para build e deploy do backend
└── template.http               # HTTP Client para testes rápidos localmente
```

---

## 🚀 Como Rodar o Backend Localmente

### Pré-requisitos
- [.NET 10 SDK](https://dotnet.microsoft.com/download) instalado localmente.
- Banco de dados PostgreSQL ativo. Você pode rodar o container do PostgreSQL a partir do diretório raiz da solução:
  ```bash
  docker compose up postgres-db -d
  ```

### Inicialização
1. Navegue até a pasta do backend:
   ```bash
   cd Backend
   ```
2. Execute o comando para rodar a aplicação:
   ```bash
   dotnet run
   ```
   *Nota: O backend possui um mecanismo de retry configurado em `DataExtensions.cs` que aguarda a inicialização completa do PostgreSQL e aplica automaticamente quaisquer migrations pendentes.*

---

## 🧪 Testando as Rotas e Documentação

### 1. Documentação Interativa com Scalar
O backend está configurado com OpenAPI e a interface **Scalar**. Com a API rodando, acesse:
- **[http://localhost:5000/scalar/v1](http://localhost:5000/scalar/v1)**

### 2. Requisições HTTP Rápidas
Você também pode testar as rotas da API usando os arquivos de teste `.http`:
- **[template.http](./template.http)** (para CRUD de itens)
- **[Backend/Features/Users/UsersEndpoints.http](./Features/Users/UsersEndpoints.http)** (para registro e autenticação de usuários)

Caso use o VS Code, basta ter a extensão **REST Client** instalada para enviar as requisições diretamente.

---

## ➕ Como Adicionar uma Nova Feature?

Para adicionar um novo módulo vertical (ex: `Products`), siga estes passos:

1. Crie uma pasta sob `/Features/Products`.
2. Adicione sua Entidade (ex: `Product.cs`).
3. (Opcional) Crie o mapeamento específico do banco de dados herdando de `IEntityTypeConfiguration<Product>` na mesma pasta. O DbContext irá detectá-la automaticamente através de `modelBuilder.ApplyConfigurationsFromAssembly`.
4. Adicione os DTOs em `ProductContracts.cs`.
5. Crie as rotas e injete o `TemplateContext` diretamente no endpoint em `ProductEndpoints.cs`.
6. Mapeie a rota em `AppExtensions.cs`.
7. Crie uma nova Migration rodando o seguinte comando a partir da pasta raiz do repositório:
   ```bash
   dotnet ef migrations add AddProductFeature -p Backend/
   ```
8. Execute a aplicação.
