# Template - Frontend Web

Este é o frontend do sistema **Template**, um aplicativo web moderno desenvolvido em Angular 22.

---

## 🛠️ Tecnologias Utilizadas

- **[Angular 22](https://angular.dev/)**: Framework principal para o desenvolvimento da SPA.
- **[Angular Material](https://material.angular.dev/)**: Biblioteca de componentes UI baseada no Material Design.
- **[Tailwind CSS v4](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)**: Framework CSS utilitário configurado especificamente para a construção do **layout**.
- **[Vitest](https://vitest.dev/)**: Runner para testes unitários rápidos.

---

## 🚀 Como Rodar o Frontend Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão `22.22.3` recomendada, conforme especificado no `package.json`).
- [NPM](https://www.npmjs.com/) (versão `11.16.0` ou superior).
- O **Backend** do projeto deve estar ativo para que as requisições à API funcionem.

### Passos para Inicialização
1. Navegue até a pasta do frontend:
   ```bash
   cd Frontend
   ```
2. Instale as dependências do projeto (caso não tenha feito ainda):
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
4. Acesse a aplicação no seu navegador em: [http://localhost:4200](http://localhost:4200). A página irá recarregar automaticamente se você fizer alterações no código.

---

## 📐 Diretrizes de Estilo e Layout (Tailwind CSS v4)

Para garantir harmonia visual no projeto, o Tailwind CSS foi configurado **exclusivamente para a criação de layouts** (posicionamento, grids, margens e alinhamentos):

- **Sem Reset de Elementos (`Preflight` Desativado)**:
  O arquivo [src/tailwind.css](./src/tailwind.css) importa apenas as configurações de tema e as classes utilitárias de layout. O reset de tags HTML do Tailwind foi desativado para garantir que os componentes do **Angular Material** permaneçam fiéis à identidade visual padrão.
- **Boas Práticas de Uso**:
  - **Use o Tailwind para**: Estruturação de grids/flexbox (`flex`, `grid`, `gap-*`, `col-span-*`), espaçamento (`p-*`, `m-*`), dimensões (`w-*`, `h-*`) e posicionamentos (`relative`, `absolute`, `z-*`).
  - **Use o Angular Material para**: Componentes visuais prontos (botões, inputs, cards, toolbars, etc.), deixando que a própria biblioteca controle as cores, bordas, sombras e tipografia.

---

## 🧪 Scripts Disponíveis

Na pasta `/Frontend`, você pode executar os seguintes comandos:

| Comando | Descrição |
| :--- | :--- |
| `npm start` | Inicia o servidor de desenvolvimento local na porta `4200`. |
| `npm run build` | Compila o aplicativo para produção e armazena o resultado em `dist/template-web`. |
| `npm run test` | Executa os testes unitários da aplicação utilizando o Vitest. |
| `npm run watch` | Compila o aplicativo em modo de desenvolvimento observando alterações em tempo real. |
