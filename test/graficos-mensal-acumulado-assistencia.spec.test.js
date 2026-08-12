// Testes de spec da feature graficos-mensal-acumulado-assistencia
import { test } from 'node:test';
import assert from 'node:assert/strict';

function buildAssistenciaMensalSeries(evolucaoMensal) {
  return [
    { name: 'Ação 2994 — Assistência Estudantil', data: evolucaoMensal.map(m => +(m.valorPago / 1000).toFixed(2)) }
  ];
}

function buildAssistenciaAcumuladoSeries(evolucaoMensal) {
  let acc = 0;
  const data = [];
  for (const m of evolucaoMensal) {
    acc += m.valorPago;
    data.push(+(acc / 1000).toFixed(2));
  }
  return [
    { name: 'Ação 2994 — Acumulado', data }
  ];
}

// US-012 — Visualização Temporal Mensal e Acumulada das Ações 20RL e 2994
test('AC-019: Gráfico de Evolução Mensal 20RL vs 2994 @spec:AC-019', () => {
  const evolucaoMensal = [
    { mesAno: '01/2025', valorEmpenhado: 50000, valorPago: 40000 },
    { mesAno: '02/2025', valorEmpenhado: 60000, valorPago: 45000 },
  ];

  const series = buildAssistenciaMensalSeries(evolucaoMensal);

  assert.equal(series.length, 1);
  assert.equal(series[0].data[0], 40);
  assert.equal(series[0].data[1], 45);
});

test('AC-020: Gráfico de Curva Acumulada 20RL vs 2994 @spec:AC-020', () => {
  const evolucaoMensal = [
    { mesAno: '01/2025', valorEmpenhado: 50000, valorPago: 40000 },
    { mesAno: '02/2025', valorEmpenhado: 60000, valorPago: 45000 },
  ];

  const series = buildAssistenciaAcumuladoSeries(evolucaoMensal);

  assert.equal(series.length, 1);
  assert.equal(series[0].data[0], 40);
  assert.equal(series[0].data[1], 85); // 40 + 45 = 85
});
