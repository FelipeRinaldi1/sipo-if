import { test } from 'node:test';
import assert from 'node:assert/strict';

interface MesExecucao {
  mesAno: string;
  empenhado: number;
  liquidado: number;
  pago: number;
}

interface SeriesItem {
  name: string;
  data: number[];
}

function buildCumulativeSeries(meses: MesExecucao[]): SeriesItem[] {
  let accEmpenhado = 0;
  let accLiquidado = 0;
  let accPago = 0;

  const empenhadoData: number[] = [];
  const liquidadoData: number[] = [];
  const pagoData: number[] = [];

  for (const m of meses) {
    accEmpenhado += m.empenhado;
    accLiquidado += m.liquidado;
    accPago += m.pago;

    empenhadoData.push(+(accEmpenhado / 1000).toFixed(2));
    liquidadoData.push(+(accLiquidado / 1000).toFixed(2));
    pagoData.push(+(accPago / 1000).toFixed(2));
  }

  return [
    { name: 'Empenhado Acumulado', data: empenhadoData },
    { name: 'Liquidado Acumulado', data: liquidadoData },
    { name: 'Pago Acumulado',      data: pagoData },
  ];
}

test('AC-017: Exibição do Gráfico de Linhas/Área Acumulado @spec:AC-017', () => {
  const meses: MesExecucao[] = [
    { mesAno: '01/2025', empenhado: 100000, liquidado: 80000, pago: 70000 },
    { mesAno: '02/2025', empenhado: 50000,  liquidado: 40000, pago: 30000 },
    { mesAno: '03/2025', empenhado: 150000, liquidado: 100000, pago: 90000 },
  ];

  const series = buildCumulativeSeries(meses);

  assert.equal(series.length, 3);
  assert.equal(series[0].name, 'Empenhado Acumulado');
  assert.equal(series[1].name, 'Liquidado Acumulado');
  assert.equal(series[2].name, 'Pago Acumulado');

  assert.equal(series[0].data[0], 100);
  assert.equal(series[1].data[0], 80);
  assert.equal(series[2].data[0], 70);

  assert.equal(series[0].data[1], 150);
  assert.equal(series[1].data[1], 120);
  assert.equal(series[2].data[1], 100);

  assert.equal(series[0].data[2], 300);
  assert.equal(series[1].data[2], 220);
  assert.equal(series[2].data[2], 190);
});
