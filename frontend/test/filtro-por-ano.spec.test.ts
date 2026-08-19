import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('AC-035: Lista de anos disponíveis gerada em anos.json @spec:AC-035', () => {
  const anosJsonPath = path.resolve(process.cwd(), 'frontend/src/assets/data/anos.json');
  assert.ok(fs.existsSync(anosJsonPath), 'anos.json deve existir em assets/data');

  const content = JSON.parse(fs.readFileSync(anosJsonPath, 'utf8'));
  assert.ok(Array.isArray(content), 'anos.json deve ser um array');
  assert.ok(content.includes('todos'), 'deve conter a opção "todos"');
  assert.ok(content.includes('2025'), 'deve conter o ano 2025');
});

test('AC-036: Dados individuais e consolidados gerados nas subpastas de assets/data @spec:AC-036', () => {
  const baseAssets = path.resolve(process.cwd(), 'frontend/src/assets/data');
  
  const ano2025Dir = path.join(baseAssets, '2025');
  assert.ok(fs.existsSync(ano2025Dir), 'subpasta 2025 deve existir');
  assert.ok(fs.existsSync(path.join(ano2025Dir, 'resumo-execucao.json')), '2025/resumo-execucao.json deve existir');
  assert.ok(fs.existsSync(path.join(ano2025Dir, 'programa-acao.json')), '2025/programa-acao.json deve existir');
  assert.ok(fs.existsSync(path.join(ano2025Dir, 'fornecedores.json')), '2025/fornecedores.json deve existir');
  assert.ok(fs.existsSync(path.join(ano2025Dir, 'documentos.json')), '2025/documentos.json deve existir');

  const todosDir = path.join(baseAssets, 'todos');
  assert.ok(fs.existsSync(todosDir), 'subpasta todos deve existir');
  assert.ok(fs.existsSync(path.join(todosDir, 'resumo-execucao.json')), 'todos/resumo-execucao.json deve existir');
  assert.ok(fs.existsSync(path.join(todosDir, 'programa-acao.json')), 'todos/programa-acao.json deve existir');
  assert.ok(fs.existsSync(path.join(todosDir, 'fornecedores.json')), 'todos/fornecedores.json deve existir');
  assert.ok(fs.existsSync(path.join(todosDir, 'documentos.json')), 'todos/documentos.json deve existir');
});

test('AC-037: Seletor de ano exibido na barra superior (mat-toolbar) @spec:AC-037', () => {
  const appHtmlPath = path.resolve(process.cwd(), 'frontend/src/app/app.html');
  const appTsPath = path.resolve(process.cwd(), 'frontend/src/app/app.ts');

  assert.ok(fs.existsSync(appHtmlPath), 'app.html deve existir');
  assert.ok(fs.existsSync(appTsPath), 'app.ts deve existir');

  const htmlContent = fs.readFileSync(appHtmlPath, 'utf8');
  const tsContent = fs.readFileSync(appTsPath, 'utf8');

  assert.ok(htmlContent.includes('mat-select'), 'app.html deve conter mat-select');
  assert.ok(htmlContent.includes('onAnoChange') || htmlContent.includes('anoSelecionado'), 'deve tratar mudança de ano');
  assert.ok(tsContent.includes('anosDisponiveis'), 'app.ts deve gerenciar anosDisponiveis');
});

test('AC-038: Troca de ano atualiza os dados de todos os componentes @spec:AC-038', () => {
  const servicePath = path.resolve(process.cwd(), 'frontend/src/app/core/services/despesas.service.ts');
  const serviceContent = fs.readFileSync(servicePath, 'utf8');

  assert.ok(serviceContent.includes('ano$') || serviceContent.includes('anoSubject'), 'DespesasService deve expor ano reativo');
  assert.ok(serviceContent.includes('setAno'), 'DespesasService deve permitir setAno');
});
