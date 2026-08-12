// Testes de spec da feature grafico-acumulado-execucao
import { test } from 'node:test';
import assert from 'node:assert/strict';

function buildCumulativeSeries(meses) {
  let accEmpenhado = 0;
  let accLiquidado = 0;
  let accPago = 0;

  const empenhadoData = [];
  const liquidadoData = [];
  const pagoData = [];

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

// US-010 — Gráfico Acumulativo de Execução Orçamentária ao Longo dos Meses
test('AC-017: Exibição do Gráfico de Linhas/Área Acumulado @spec:AC-017', () => {
  const meses = [
    { mesAno: '01/2025', empenhado: 100000, liquidado: 80000, pago: 70000 },
    { mesAno: '02/2025', empenhado: 50000,  liquidado: 40000, pago: 30000 },
    { mesAno: '03/2025', empenhado: 150000, liquidado: 100000, pago: 90000 },
  ];

  const series = buildCumulativeSeries(meses);

  assert.equal(series.length, 3);
  assert.equal(series[0].name, 'Empenhado Acumulado');
  assert.equal(series[1].name, 'Liquidado Acumulado');
  assert.equal(series[2].name, 'Pago Acumulado');

  // Mês 1: 100k, 80k, 70k -> R$ mil: 100, 80, 70
  assert.equal(series[0].data[0], 100);
  assert.equal(series[1].data[0], 80);
  assert.equal(series[2].data[0], 70);

  // Mês 2 acumulado: 150k, 120k, 100k -> R$ mil: 150, 120, 100
  assert.equal(series[0].data[1], 150);
  assert.equal(series[1].data[1], 120);
  assert.equal(series[2].data[1], 100);

  // Mês 3 acumulado: 300k, 220k, 190k -> R$ mil: 300, 220, 190
  assert.equal(series[0].data[2], 300);
  assert.equal(series[1].data[2], 220);
  assert.equal(series[2].data[2], 190);
});
