// Testes de spec da feature identidade-visual-ifsp
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// US-009 — Identidade Visual Oficial do IFSP no Frontend
test('AC-016: Aplicação do Tema Institucional Verde e Vermelho do IFSP @spec:AC-016', () => {
  // Dado: os arquivos de estilo do Frontend (styles.scss, tailwind.css, etc.)
  const stylesScssPath = path.resolve(process.cwd(), 'Frontend/src/styles.scss');
  const tailwindCssPath = path.resolve(process.cwd(), 'Frontend/src/tailwind.css');

  assert.ok(fs.existsSync(stylesScssPath), 'styles.scss deve existir');
  assert.ok(fs.existsSync(tailwindCssPath), 'tailwind.css deve existir');

  const stylesContent = fs.readFileSync(stylesScssPath, 'utf8');
  const tailwindContent = fs.readFileSync(tailwindCssPath, 'utf8');

  // Verifica se as cores institucionais do IFSP (#006633 ou #135029 e #cc0000 ou #c8102e) estão definidas nos estilos ou variáveis CSS
  const hasIfspGreen = /#006633|#135029|ifsp-green|ifsp-verde/i.test(stylesContent + tailwindContent);
  const hasIfspRed = /#cc0000|#c8102e|ifsp-red|ifsp-vermelho/i.test(stylesContent + tailwindContent);

  assert.ok(hasIfspGreen, 'Estilos devem conter a cor verde institucional do IFSP (#006633 ou variável)');
  assert.ok(hasIfspRed, 'Estilos devem conter a cor vermelha institucional do IFSP (#cc0000 ou variável)');
});
