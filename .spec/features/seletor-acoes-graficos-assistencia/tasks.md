# Tarefas: Seletor de Ação e Gráficos de Linha

> feature: seletor-acoes-graficos-assistencia

## T-020 — Implementar seletor de ação e converter ambos os gráficos para linha [concluida]
- Refs: US-013, AC-021, AC-022
- Arquivos: `Frontend/src/app/features/destinacao-estudantil/destinacao-estudantil.ts`, `Frontend/src/app/features/destinacao-estudantil/destinacao-estudantil.html`
- Dependências: nenhuma
- Parâmetros para IA:
  - Modelo: claude-sonnet-5
  - Esforço: medio
- Notas: Adicionar sinal `acaoSelecionada` ('2994' | '20RL'), atualizar `evolucaoMensalChart` e `acumuladoChart` para `type: 'line'`, e incluir botões no template.
