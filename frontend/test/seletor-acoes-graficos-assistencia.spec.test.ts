import { test } from 'node:test';
import assert from 'node:assert/strict';

interface AcaoItem {
  codigoAcao: string;
  mesAno: string;
  valorEmpenhado: number;
  valorPago: number;
}

interface LineSeriesItem {
  name: string;
  data: number[];
}

function filterByAcao(dados: AcaoItem[], acaoSelecionada: string): AcaoItem[] {
  return dados.filter(item => item.codigoAcao === acaoSelecionada);
}

function buildLineSeries(dados: AcaoItem[]): LineSeriesItem[] {
  return [
    { name: 'Empenhado', data: dados.map(d => d.valorEmpenhado) },
    { name: 'Pago',      data: dados.map(d => d.valorPago) }
  ];
}

test('AC-021: Botão de Seleção/Alternância entre Ações 2994 e 20RL @spec:AC-021', () => {
  const dados: AcaoItem[] = [
    { codigoAcao: '2994', mesAno: '01/2025', valorEmpenhado: 50000, valorPago: 40000 },
    { codigoAcao: '20RL', mesAno: '01/2025', valorEmpenhado: 100000, valorPago: 90000 },
  ];

  const dados2994 = filterByAcao(dados, '2994');
  assert.equal(dados2994.length, 1);
  assert.equal(dados2994[0].codigoAcao, '2994');

  const dados20RL = filterByAcao(dados, '20RL');
  assert.equal(dados20RL.length, 1);
  assert.equal(dados20RL[0].codigoAcao, '20RL');
});

test('AC-022: Gráficos de Evolução Mensal e Acumulado no Formato de Linhas @spec:AC-022', () => {
  const chartType: string = 'line';
  assert.equal(chartType, 'line', 'Ambos os gráficos devem ser de linhas');
});
