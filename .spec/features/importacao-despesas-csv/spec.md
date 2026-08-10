# Spec: Importacao despesas csv

> feature: importacao-despesas-csv
> status: em-andamento

## Contexto

Esta funcionalidade provê a ingestão, parsing e persistência dos arquivos CSV de despesas (`despesasPorOrgao.csv`, `despesasPorProgramaAcao.csv`, `documentos.csv`) no banco de dados PostgreSQL.

## Histórias

### US-001 — Leitura e Persistência dos Arquivos CSV de Despesas

Como administrador/sistema,
Quero importar os arquivos CSV de despesas disponibilizados no diretório de uploads,
Para que os dados estejam disponíveis no banco relacional para consultas e gráficos.

#### AC-001 — Importação de Despesas por Órgão

- **Dado** o arquivo CSV `despesasPorOrgao.csv` no diretório de uploads
- **Quando** a rotina de importação for acionada
- **Então** os registros devem ser convertidos e salvos na tabela `DespesasPorOrgao`.

#### AC-002 — Importação de Despesas por Programa e Ação

- **Dado** o arquivo CSV `despesasPorProgramaAcao.csv` no diretório de uploads
- **Quando** a rotina de importação for acionada
- **Então** os registros devem ser convertidos e salvos na tabela `DespesasPorProgramaAcao`.

#### AC-003 — Importação de Extrato de Documentos

- **Dado** o arquivo CSV `documentos.csv` no diretório de uploads
- **Quando** a rotina de importação for acionada
- **Então** os registros detalhados devem ser salvos na tabela `DespesasDocumento`.

## Fora de escopo

- Validação manual/interface gráfica para upload individual de arquivos pelo navegador (nesta fase os arquivos vêm de `uploads/`).

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-001 | Os arquivos usam `;` como separador de colunas e vírgula como separador decimal. | confirmada | Implementado no parser. |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-001 | Qual o comportamento ao reimportar os arquivos CSV se já houver dados no banco? | respondida | Sobrescrever (limpar registros existentes e reimportar). *(Pode mudar futuramente)* |
