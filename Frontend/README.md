# SIPO-IF: Frontend Web

Interface SPA em Angular desenvolvida com a identidade visual institucional do IFSP.

## Estrutura do Projeto

```text
Frontend/src/
├── app/
│   ├── core/         # Serviços de comunicação HTTP com o Backend
│   └── features/     # Componentes das abas do dashboard
│       ├── painel-execucao/        # Métricas globais e gráficos acumulados
│       ├── destinacao-estudantil/ # Ações 20RL e 2994 com filtro e gráficos
│       ├── gestao-fornecedores/   # Ranking Top 5 fornecedores
│       └── categorias/            # Donut de elementos de despesa
├── styles.scss       # Tema global e variáveis de cores do IFSP (#006633 e #cc0000)
└── tailwind.css      # Utilitários de layout (Flexbox/Grid)
```

---

## Como Rodar Localmente

1. Instalar dependências:
   ```bash
   cd Frontend
   npm install
   ```

2. Executar o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   Acesse: http://localhost:4200

---

## Comandos Úteis

- `npm start`: Inicia o servidor local na porta 4200.
- `npm run build`: Compila os arquivos para produção.
- `npm run test`: Executa os testes do frontend com Vitest.
