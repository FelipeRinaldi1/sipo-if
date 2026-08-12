# Spec: Filtro de Ações Orçamentárias (20RL e 2994) na Assistência Estudantil

> feature: filtro-acoes-assistencia
> status: implementada

## Contexto

Restringir os dados exibidos na aba "Assistência Estudantil" para incluir estritamente as ações orçamentárias **20RL** (Funcionamento das Instituições) e **2994** (Assistência aos Estudantes), descartando quaisquer outras ações residuais da visualização comparativa e tabelas dessa aba.

## Histórias

### US-011 — Exibição Exclusiva das Ações 20RL e 2994 na Assistência Estudantil

Como cidadão ou gestor,
Quero visualizar na aba "Assistência Estudantil" apenas as informações relativas às ações 20RL e 2994,
Para focar o comparativo estritamente entre os recursos de assistência aos alunos e de funcionamento do campus.

#### AC-018 — Filtragem Restrita das Ações 20RL e 2994

- **Dado** o resumo de programas e ações recebido da API
- **Quando** a aba "Assistência Estudantil" for carregada
- **Então** a lista de ações, os totais dos cards, o gráfico comparativo e as proporções exibidas devem considerar exclusivamente os registros das ações `20RL` e `2994`.

## Fora de escopo

- Alterações na aba de Gestão de Fornecedores ou Despesas por Categoria.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-012 | A filtragem pode ser aplicada no Frontend filtrando o array `acoes` pelas chaves `20RL` e `2994`. | confirmada | Permite visualização limpa e focada no objetivo da aba. |

## Perguntas em aberto

Nenhuma.
