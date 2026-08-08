# Definicao Tecnica

Arquitetura
- Frontend: Angular versao 22 utilizando componentes responsivos
- Backend: Minimal API .NET 10 estruturada em features verticais
- Banco de dados: PostgreSQL rodando em container Docker

Integracao
- Comunicacao via chamadas HTTP REST com payload JSON
- Autenticacao baseada em tokens JWT nas requisicoes protegidas

Persistencia
- Entity Framework Core para mapeamento objeto relacional
- Migrations automaticas aplicadas no startup da aplicacao
- Mapeamento e definicao de tabelas usando Data Annotations diretamente nos modelos
- DbSets declarados no DbContext global para acesso direto, seguindo as melhores práticas do Entity Framework Core e permitindo autocomplete e resolução de tipos nas features.
