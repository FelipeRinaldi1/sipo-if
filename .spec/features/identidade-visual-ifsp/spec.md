# Spec: Identidade Visual IFSP

> feature: identidade-visual-ifsp
> status: implementada

## Contexto

Adequar a identidade visual do portal SIPO-IF para seguir os padrões oficiais do IFSP (Instituto Federal de Educação, Ciência e Tecnologia de São Paulo).
O site deve utilizar a paleta de cores institucional oficial (Verde IFSP `#006633` / `#135029`, Vermelho IFSP `#cc0000` / `#c8102e`, Branco e Tons Neutros) e aplicar essa temática de forma consistente no Angular Material (Material 3) e nos componentes customizados (gráficos ApexCharts, chips, cabeçalho e navegação).

## Histórias

### US-009 — Identidade Visual Oficial do IFSP no Frontend

Como usuário do sistema SIPO-IF,
Quero navegar por uma interface com as cores e o padrão visual oficial do IFSP,
Para identificar claramente a associação institucional do portal e ter uma experiência visual padronizada.

#### AC-016 — Aplicação do Tema Institucional Verde e Vermelho do IFSP

- **Dado** a aplicação Angular com Angular Material e TailwindCSS
- **Quando** o tema global e as variáveis de estilo forem atualizados com a paleta oficial do IFSP (Verde `#006633` como cor primária e Vermelho `#cc0000` como cor de destaque/accent)
- **Então** os componentes principais (toolbar, botões, chips, barras de progresso e paletas dos gráficos) devem refletir a nova identidade visual sem quebrar o layout.

## Fora de escopo

- Alterações na estrutura das APIs do backend.
- Mudanças na lógica de negócio ou dados dos gráficos.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-010 | As cores do IFSP seguem o manual de identidade visual do IF (Verde institucional `#006633` / `#135029` e Vermelho `#cc0000`). | confirmada | Confirmado na exigência do usuário. |

## Perguntas em aberto

Nenhuma.
