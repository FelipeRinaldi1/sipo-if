# Spec: Sincronizacao transparencia

> feature: sincronizacao-transparencia
> status: rascunho

<!--
  Como ler este arquivo (o formato é verificado por `onp-spec audit`):
  - US-xxx = história de usuário · AC-xxx = critério de aceite
    ASM-xxx = suposição · Q-xxx = pergunta em aberto
    São códigos de rastreio: ligam a especificação às tarefas e aos testes.
  - Toda história de usuário precisa de pelo menos um critério de aceite.
  - Todo critério de aceite precisa de Dado/Quando/Então completos.
  - Os códigos são únicos no projeto inteiro (nunca reutilize um número).
  - Suposições e Perguntas em aberto são OBRIGATÓRIAS: se não há nenhuma,
    escreva "Nenhuma." — mas desconfie: quase toda feature esconde uma.
-->

## Contexto

O IFSP Campus Jacareí (UG 158716) tem seus dados de despesas e empenhos publicados
na API do Portal da Transparência do Governo Federal. Hoje esses dados são consultados
manualmente. Esta feature automatiza a coleta, armazena localmente no banco e garante
que o dashboard público sempre tenha dados atualizados — mesmo que a API governamental
esteja instável.

## Histórias

### US-001 — Sincronização automática de dados orçamentários

Como sistema, quero buscar periodicamente os dados de despesas e empenhos da UG 158716
na API do Portal da Transparência, para que o dashboard público exiba sempre informações
atualizadas sem intervenção manual.

#### AC-001 — Dados de despesas são persistidos no banco após sincronização

- **Dado** que a API do Portal da Transparência está acessível e retorna dados para a UG 158716
- **Quando** o job de sincronização é executado
- **Então** os registros de despesas (empenhado, liquidado, pago) são salvos ou atualizados no banco local

#### AC-002 — Sincronização não duplica registros existentes

- **Dado** que um empenho já foi importado em uma sincronização anterior
- **Quando** o job de sincronização é executado novamente
- **Então** o registro existente é atualizado (upsert) e não há duplicatas no banco

#### AC-003 — Falha na API governamental não derruba o sistema

- **Dado** que a API do Portal da Transparência retorna erro ou timeout
- **Quando** o job de sincronização é executado
- **Então** o erro é registrado em log, a sincronização anterior permanece íntegra no banco e o sistema continua respondendo normalmente

### US-002 — Rastreabilidade da última sincronização

Como administrador, quero saber quando foi a última sincronização bem-sucedida com o
Portal da Transparência, para que eu possa identificar se os dados estão desatualizados.

#### AC-004 — Registro de data/hora da última sincronização bem-sucedida

- **Dado** que uma sincronização foi concluída com sucesso
- **Quando** o administrador consulta o status da sincronização
- **Então** o sistema exibe a data e hora exata da última sincronização bem-sucedida (UTC)

#### AC-005 — Registro de falha de sincronização

- **Dado** que uma sincronização falhou (erro de rede, API indisponível, resposta inválida)
- **Quando** o administrador consulta o status da sincronização
- **Então** o sistema exibe a data/hora e a mensagem de erro da última tentativa falha

## Fora de escopo

- Interface visual de configuração do agendamento (o intervalo é definido via variável de ambiente)
- Sincronização manual disparada pelo usuário via interface (pode ser uma feature futura)
- Importação de dados de outras UGs ou órgãos
- Transformação analítica dos dados — esta feature só coleta e persiste

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-001 | A API do Portal da Transparência exige chave de acesso (chave-api-dados) no header | confirmada | Fornecida pelo usuário |
| ASM-002 | O intervalo de sincronização é diário às 06:00 AM | confirmada | Definido pelo usuário |
| ASM-003 | Os dados históricos a importar começam a partir do ano de 2020 | confirmada | Definido pelo usuário |
| ASM-004 | O mecanismo de agendamento será o Hosted Service do .NET (IHostedService) | confirmada | Padrão .NET |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-001 | A partir de qual ano devemos importar os dados históricos? | respondida | A partir de 2020 |
| Q-002 | Qual o intervalo desejado de sincronização? | respondida | Diário, executando às 06h da manhã |
| Q-003 | A chave de API do Portal da Transparência é necessária? | respondida | Sim, informada via env var `PORTAL_TRANSPARENCIA_API_KEY` |
| Q-004 | Em caso de falha de sincronização, a equipe precisa ser notificada? | aberta | Registrado no log do banco por enquanto (MVP) |
