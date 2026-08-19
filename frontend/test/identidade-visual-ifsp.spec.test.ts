import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('AC-016: Aplicação do Tema Institucional Verde e Vermelho do IFSP @spec:AC-016', () => {
  const stylesScssPath: string = path.resolve(process.cwd(), 'frontend/src/styles.scss');
  const tailwindCssPath: string = path.resolve(process.cwd(), 'frontend/src/tailwind.css');

  assert.ok(fs.existsSync(stylesScssPath), 'styles.scss deve existir');
  assert.ok(fs.existsSync(tailwindCssPath), 'tailwind.css deve existir');

  const stylesContent: string = fs.readFileSync(stylesScssPath, 'utf8');
  const tailwindContent: string = fs.readFileSync(tailwindCssPath, 'utf8');

  const hasIfspGreen: boolean = /#006633|#135029|ifsp-green|ifsp-verde/i.test(stylesContent + tailwindContent);
  const hasIfspRed: boolean = /#cc0000|#c8102e|ifsp-red|ifsp-vermelho/i.test(stylesContent + tailwindContent);

  assert.ok(hasIfspGreen, 'Estilos devem conter a cor verde institucional do IFSP (#006633 ou variável)');
  assert.ok(hasIfspRed, 'Estilos devem conter a cor vermelha institucional do IFSP (#cc0000 ou variável)');
});
