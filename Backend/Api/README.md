# SIPO-IF: Backend API

API REST desenvolvida em C# (.NET 10) para consulta e gestão de dados orçamentários do IFSP.

## Estrutura do Projeto

O projeto utiliza arquitetura em fatias verticais (Vertical Slice):

```text
Backend/
├── Data/              # DbContext (EF Core) e migrações PostgreSQL
├── Extensions/        # Configuração de serviços e middlewares
└── Features/          # Módulos de negócio (Despesas, Users)
    ├── Despesas/      # Endpoints, queries e serviços orçamentários
    └── Users/         # Autenticação e gestão de usuários
```

---

## Como Rodar Localmente

1. Subir banco de dados PostgreSQL:
   ```bash
   docker compose up postgres-db -d
   ```

2. Executar a API:
   ```bash
   cd Backend
   dotnet run
   ```

3. Documentação OpenAPI (Scalar):
   http://localhost:5000/scalar/v1

---

## Testes

Executar suíte de testes unitários e de integração C#:
```bash
dotnet test Api.Tests
```
