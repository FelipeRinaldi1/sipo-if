import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseDespesasPorOrgao, parseDespesasPorProgramaAcao, parseDespesasDocumento, gerarDados } from '../../scripts/gerar-dados.ts';
import { aggregateDashboard } from '../../scripts/aggregators/dashboard.ts';
import { aggregateProgramaAcao } from '../../scripts/aggregators/programa-acao.ts';
import { aggregateFornecedores } from '../../scripts/aggregators/fornecedores.ts';

test('AC-023: resumo-execucao.json gerado com estrutura correta @spec:AC-023', () => {
  const filePath = path.resolve(process.cwd(), 'frontend/src/assets/data/resumo-execucao.json');
  assert.ok(fs.existsSync(filePath), 'resumo-execucao.json deve existir');

  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  assert.ok('totalEmpenhado' in content, 'deve ter totalEmpenhado');
  assert.ok('totalLiquidado' in content, 'deve ter totalLiquidado');
  assert.ok('totalPago' in content, 'deve ter totalPago');
  assert.ok('totalRestosAPagarPagos' in content, 'deve ter totalRestosAPagarPagos');
  assert.ok(Array.isArray(content.evolucaoMensal), 'deve ter evolucaoMensal como array');
  assert.ok(content.evolucaoMensal.length > 0, 'evolucaoMensal deve conter itens');
});

test('AC-024: programa-acao.json gerado com estrutura correta @spec:AC-024', () => {
  const filePath = path.resolve(process.cwd(), 'frontend/src/assets/data/programa-acao.json');
  assert.ok(fs.existsSync(filePath), 'programa-acao.json deve existir');

  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  assert.ok('totalGeralEmpenhado' in content, 'deve ter totalGeralEmpenhado');
  assert.ok('totalGeralPago' in content, 'deve ter totalGeralPago');
  assert.ok(Array.isArray(content.acoes), 'deve ter acoes como array');
  assert.ok(Array.isArray(content.evolucaoAssistenciaMensal), 'deve ter evolucaoAssistenciaMensal como array');
});

test('AC-025: fornecedores.json gerado com estrutura correta @spec:AC-025', () => {
  const filePath = path.resolve(process.cwd(), 'frontend/src/assets/data/fornecedores.json');
  assert.ok(fs.existsSync(filePath), 'fornecedores.json deve existir');

  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  assert.ok('totalGeral' in content, 'deve ter totalGeral');
  assert.ok(Array.isArray(content.topFornecedores), 'deve ter topFornecedores como array');
  assert.ok(content.topFornecedores.length <= 5, 'topFornecedores deve ter no máximo 5');
  assert.ok(Array.isArray(content.elementosDespesa), 'deve ter elementosDespesa como array');
});

test('AC-026: CLI retorna erro claro quando CSV não existe @spec:AC-026', () => {
  assert.throws(() => {
    gerarDados('9999_inexistente', '/caminho/falso/nao_existe');
  }, /Erro|não encontrado/i);
});

test('AC-027: DespesasService aponta para assets locais (resumo-execucao) @spec:AC-027', () => {
  const servicePath = path.resolve(process.cwd(), 'frontend/src/app/core/services/despesas.service.ts');
  const content = fs.readFileSync(servicePath, 'utf8');

  assert.ok(content.includes('assets/data') || content.includes('resumo-execucao.json'), 'deve apontar para assets/data');
  assert.ok(!content.includes('localhost:5000'), 'não deve apontar para localhost:5000');
});

test('AC-028: DespesasService aponta para assets locais (programa-acao e fornecedores) @spec:AC-028', () => {
  const servicePath = path.resolve(process.cwd(), 'frontend/src/app/core/services/despesas.service.ts');
  const content = fs.readFileSync(servicePath, 'utf8');

  assert.ok(content.includes('programa-acao.json'), 'deve referenciar programa-acao.json');
  assert.ok(content.includes('fornecedores.json'), 'deve referenciar fornecedores.json');
});

test('AC-029: Documentos paginados servidos por JSON local com paginação no cliente @spec:AC-029', () => {
  const servicePath = path.resolve(process.cwd(), 'frontend/src/app/core/services/despesas.service.ts');
  const docsJsonPath = path.resolve(process.cwd(), 'frontend/src/assets/data/documentos.json');
  const content = fs.readFileSync(servicePath, 'utf8');

  assert.ok(fs.existsSync(docsJsonPath), 'documentos.json deve existir em assets/data');
  assert.ok(content.includes('documentos.json'), 'deve carregar de documentos.json');
  assert.ok(content.includes('slice(') || content.includes('totalPaginas'), 'deve implementar lógica de paginação no cliente');
});

test('AC-030: Workflow existe com trigger mensal e manual @spec:AC-030', () => {
  const wfPath = path.resolve(process.cwd(), '.github/workflows/atualizar-dados.yml');
  assert.ok(fs.existsSync(wfPath), 'Workflow atualizar-dados.yml deve existir');

  const content = fs.readFileSync(wfPath, 'utf8');
  assert.ok(content.includes('schedule:') && content.includes('cron:'), 'deve conter schedule com cron');
  assert.ok(content.includes('workflow_dispatch:'), 'deve conter trigger workflow_dispatch');
});

test('AC-031: Workflow faz commit dos JSONs gerados sem falhar se nada mudou @spec:AC-031', () => {
  const wfPath = path.resolve(process.cwd(), '.github/workflows/atualizar-dados.yml');
  const content = fs.readFileSync(wfPath, 'utf8');

  assert.ok(content.includes('git commit') || content.includes('git-auto-commit'), 'deve fazer commit');
  assert.ok(content.includes('git diff') || content.includes('quiet') || content.includes('--allow-empty'), 'deve tratar caso sem alterações');
});

test('AC-032: Workflow publica no GitHub Pages após atualização @spec:AC-032', () => {
  const wfPath = path.resolve(process.cwd(), '.github/workflows/atualizar-dados.yml');
  const content = fs.readFileSync(wfPath, 'utf8');

  assert.ok(content.includes('actions/deploy-pages'), 'deve usar actions/deploy-pages');
  assert.ok(content.includes('actions/upload-pages-artifact'), 'deve usar actions/upload-pages-artifact');
});

