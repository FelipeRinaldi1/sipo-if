# Spec: Extrato transparencia documentos

> feature: extrato-transparencia-documentos
> status: rascunho

## Contexto

Esta funcionalidade provê a tabela interativa de busca, consulta e filtros do extrato completo de documentos de despesas do campus.

## Histórias

### US-005 — Extrato e Busca Transparente de Documentos de Despesa

Como usuário do portal de transparência,
Quero buscar e filtrar qualquer documento de despesa por fornecedor, número do documento ou fase,
Para auditar lançamentos específicos do campus.

#### AC-010 — Consulta Paginada do Extrato de Documentos

- **Dado** o acervo de lançamentos de documentos
- **Quando** a tela de extrato for acessada
- **Então** o sistema deve listar os registros em formato de tabela paginada com colunas: Data, Documento, Favorecido, Fase, Elemento e Valor.

#### AC-011 — Filtro e Busca Rápida de Documentos

- **Dado** a tabela de extrato transparente
- **Quando** o usuário digitar um nome/CNPJ de fornecedor ou número de documento no campo de busca
- **Então** a lista deve ser filtrada instantaneamente exibindo apenas os registros correspondentes.

## Fora de escopo

- Impressão física via impressora matricial.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-005 | A paginação no Backend usa parâmetros padrão `skip` e `take` ou `page` e `pageSize`. | confirmada | Padrão REST minimal APIs. |

## Perguntas em aberto

Nenhuma.
