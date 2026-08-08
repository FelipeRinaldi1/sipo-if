# Template

Bem-vindo ao repositório do **Template**. Este projeto é uma solução fullstack organizada em monorepo, composta por uma API de alto desempenho no backend, uma interface moderna no frontend e documentação técnica unificada.

---

## 🛠️ Arquitetura do Projeto

O repositório é dividido em três diretórios principais:

*   **[Backend](./Backend/README.md)**: API REST desenvolvida com C# (.NET 10), utilizando Minimal APIs, Entity Framework Core e banco de dados PostgreSQL.
*   **[Frontend](./Frontend/README.md)**: Aplicativo web desenvolvido com Angular 22, utilizando Angular Material para os componentes e Tailwind CSS v4 para o design do layout.
*   **[Docs](./Docs)**: Documentações complementares, diagramas de banco de dados, regras de negócio e guias.

---

## 🚀 Como Rodar o Projeto Completo

A forma mais rápida de subir toda a aplicação e o banco de dados localmente é através do **Docker Compose**.

### Pré-requisitos
- [Docker](https://www.docker.com/) instalado.
- [Docker Compose](https://docs.docker.com/compose/) instalado.

### Passo a Passo

1. **Configurar as Variáveis de Ambiente**:
   Copie o arquivo `.env.example` na raiz do projeto para criar o seu arquivo `.env`:
   ```bash
   cp .env.example .env
   ```
   *Abra o arquivo `.env` e configure as credenciais do banco PostgreSQL conforme sua preferência.*

2. **Iniciar todos os Serviços**:
   Suba os containers do backend, frontend e banco de dados rodando o comando na raiz do projeto:
   ```bash
   docker compose up --build -d
   ```

3. **Acessar as Aplicações**:
   - **Frontend**: Disponível em [http://localhost:4200](http://localhost:4200).
   - **Backend (API)**: Disponível em [http://localhost:5000](http://localhost:5000).
   - **Documentação da API (Scalar)**: Disponível em [http://localhost:5000/scalar/v1](http://localhost:5000/scalar/v1).

---

## 📖 Instruções Detalhadas de Desenvolvimento

Se você deseja desenvolver localmente rodando os serviços fora do Docker ou quer ver comandos de testes, consulte os guias específicos:

*   👉 **[Guia do Desenvolvedor Backend (C# / .NET)](./Backend/README.md)**
*   👉 **[Guia do Desenvolvedor Frontend (Angular)](./Frontend/README.md)**
