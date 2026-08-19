import type { DespesaPorOrgao, ResumoExecucao, EvolucaoMensalItem } from '../types.ts';

export function parseMesAnoSortKey(mesAno: string): number {
  const parts = mesAno.split('/');
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    if (!isNaN(m) && !isNaN(y)) {
      return y * 100 + m;
    }
  }
  return 0;
}

export function aggregateDashboard(registros: DespesaPorOrgao[]): ResumoExecucao {
  let totalEmpenhado = 0;
  let totalLiquidado = 0;
  let totalPago = 0;
  let totalRestosAPagarPagos = 0;

  const grupos = new Map<string, { empenhado: number; liquidado: number; pago: number; restosAPagarPagos: number }>();

  for (const r of registros) {
    totalEmpenhado += r.valorEmpenhado;
    totalLiquidado += r.valorLiquidado;
    totalPago += r.valorPago;
    totalRestosAPagarPagos += r.valorRestosAPagarPagos;

    let grupo = grupos.get(r.mesAno);
    if (!grupo) {
      grupo = { empenhado: 0, liquidado: 0, pago: 0, restosAPagarPagos: 0 };
      grupos.set(r.mesAno, grupo);
    }
    grupo.empenhado += r.valorEmpenhado;
    grupo.liquidado += r.valorLiquidado;
    grupo.pago += r.valorPago;
    grupo.restosAPagarPagos += r.valorRestosAPagarPagos;
  }

  const evolucaoMensal: EvolucaoMensalItem[] = Array.from(grupos.entries())
    .map(([mesAno, vals]) => ({
      mesAno,
      empenhado: Math.round(vals.empenhado * 100) / 100,
      liquidado: Math.round(vals.liquidado * 100) / 100,
      pago: Math.round(vals.pago * 100) / 100,
      restosAPagarPagos: Math.round(vals.restosAPagarPagos * 100) / 100
    }))
    .sort((a, b) => parseMesAnoSortKey(a.mesAno) - parseMesAnoSortKey(b.mesAno));

  return {
    totalEmpenhado: Math.round(totalEmpenhado * 100) / 100,
    totalLiquidado: Math.round(totalLiquidado * 100) / 100,
    totalPago: Math.round(totalPago * 100) / 100,
    totalRestosAPagarPagos: Math.round(totalRestosAPagarPagos * 100) / 100,
    evolucaoMensal
  };
}
