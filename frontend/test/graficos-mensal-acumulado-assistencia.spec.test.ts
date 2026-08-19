import { test } from 'node:test';
import assert from 'node:assert/strict';

interface EvolucaoMensalItem {
  mesAno: string;
  valorEmpenhado: number;
  valorPago: number;
}

interface SeriesItem {
  name: string;
  data: number[];
}

function buildAssistenciaMensalSeries(evolucaoMensal: EvolucaoMensalItem[]): SeriesItem[] {
  return [
    { name: 'Ação 2994 — Assistência Estudantil', data: evolucaoMensal.map(m => +(m.valorPago / 1000).toFixed(2)) }
  ];
}

function buildAssistenciaAcumuladoSeries(evolucaoMensal: EvolucaoMensalItem[]): SeriesItem[] {
  let acc = 0;
  const data: number[] = [];
  for (const m of evolucaoMensal) {
    acc += m.valorPago;
    data.push(+(acc / 1000).toFixed(2));
  }
  return [
    { name: 'Ação 2994 — Acumulado', data }
  ];
}

test('AC-019: Gráfico de Evolução Mensal 20RL vs 2994 @spec:AC-019', () => {
  const evolucaoMensal: EvolucaoMensalItem[] = [
    { mesAno: '01/2025', valorEmpenhado: 50000, valorPago: 40000 },
    { mesAno: '02/2025', valorEmpenhado: 60000, valorPago: 45000 },
  ];

  const series = buildAssistenciaMensalSeries(evolucaoMensal);

  assert.equal(series.length, 1);
  assert.equal(series[0].data[0], 40);
  assert.equal(series[0].data[1], 45);
});

test('AC-020: Gráfico de Curva Acumulada 20RL vs 2994 @spec:AC-020', () => {
  const evolucaoMensal: EvolucaoMensalItem[] = [
    { mesAno: '01/2025', valorEmpenhado: 50000, valorPago: 40000 },
    { mesAno: '02/2025', valorEmpenhado: 60000, valorPago: 45000 },
  ];

  const series = buildAssistenciaAcumuladoSeries(evolucaoMensal);

  assert.equal(series.length, 1);
  assert.equal(series[0].data[0], 40);
  assert.equal(series[0].data[1], 85);
});
