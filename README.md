# SIPO-IF: Sistema Transparente de Gestão Orçamentária

Sistema de transparência financeira e gestão orçamentária do IFSP Campus Jacareí.

## Arquitetura

O projeto é estruturado em monorepo com duas aplicações principais:

- `Backend`: API REST em .NET 10 (Minimal APIs, EF Core, PostgreSQL).
- `Frontend`: Single Page Application em Angular (Angular Material, ApexCharts, Tailwind CSS).

---

## Como Rodar com Docker

1. Copiar variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Subir os containers (Backend, Frontend e PostgreSQL):
   ```bash
   docker compose up --build -d
   ```

3. URLs de acesso:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000
   - Documentação da API: http://localhost:5000/scalar/v1

---

## Testes Automatizados

- Backend:
  ```bash
  dotnet test Backend.Tests
  ```
- Especificações / Frontend:
  ```bash
  node --test test/*.spec.test.js
  ```

---

## Documentação Específica

- [Documentação Backend](./Backend/README.md)
- [Documentação Frontend](./Frontend/README.md)
