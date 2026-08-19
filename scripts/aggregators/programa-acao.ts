import type { DespesaPorProgramaAcao, ResumoProgramaAcao, ItemAcaoResumo, EvolucaoAcaoItem } from '../types.ts';
import { parseMesAnoSortKey } from './dashboard.ts';

export function extrairCodigoAcao(rawAcao: string): string {
  if (!rawAcao || !rawAcao.trim()) return 'OUTRAS';
  const parts = rawAcao.split('-');
  if (parts.length > 0 && parts[0].trim()) {
    return parts[0].trim();
  }
  return rawAcao.trim();
}

export function aggregateProgramaAcao(registros: DespesaPorProgramaAcao[]): ResumoProgramaAcao {
  let totalGeralEmpenhado = 0;
  let totalGeralPago = 0;

  for (const r of registros) {
    totalGeralEmpenhado += r.valorEmpenhado;
    totalGeralPago += r.valorPago;
  }

  const acoesMap = new Map<string, { nome: string; empenhado: number; liquidado: number; pago: number }>();
  for (const r of registros) {
    const cod = extrairCodigoAcao(r.acaoOrcamentaria);
    let acao = acoesMap.get(cod);
    if (!acao) {
      acao = { nome: r.acaoOrcamentaria, empenhado: 0, liquidado: 0, pago: 0 };
      acoesMap.set(cod, acao);
    }
    acao.empenhado += r.valorEmpenhado;
    acao.liquidado += r.valorLiquidado;
    acao.pago += r.valorPago;
  }

  const acoes: ItemAcaoResumo[] = Array.from(acoesMap.entries())
    .map(([cod, item]) => {
      const pct = totalGeralPago > 0 ? Math.round((item.pago / totalGeralPago) * 10000) / 100 : 0;
      return {
        codigoAcao: cod,
        nomeAcao: item.nome,
        totalEmpenhado: Math.round(item.empenhado * 100) / 100,
        totalLiquidado: Math.round(item.liquidado * 100) / 100,
        totalPago: Math.round(item.pago * 100) / 100,
        porcentagemDoTotal: pct
      };
    })
    .sort((a, b) => b.totalPago - a.totalPago);

  const evolucaoMap = new Map<string, { codigoAcao: string; mesAno: string; empenhado: number; liquidado: number; pago: number }>();
  for (const r of registros) {
    const cod = extrairCodigoAcao(r.acaoOrcamentaria);
    const key = `${cod}_${r.mesAno}`;
    let item = evolucaoMap.get(key);
    if (!item) {
      item = { codigoAcao: cod, mesAno: r.mesAno, empenhado: 0, liquidado: 0, pago: 0 };
      evolucaoMap.set(key, item);
    }
    item.empenhado += r.valorEmpenhado;
    item.liquidado += r.valorLiquidado;
    item.pago += r.valorPago;
  }

  const evolucaoAssistenciaMensal: EvolucaoAcaoItem[] = Array.from(evolucaoMap.values())
    .map(item => ({
      codigoAcao: item.codigoAcao,
      mesAno: item.mesAno,
      valorEmpenhado: Math.round(item.empenhado * 100) / 100,
      valorLiquidado: Math.round(item.liquidado * 100) / 100,
      valorPago: Math.round(item.pago * 100) / 100
    }))
    .sort((a, b) => parseMesAnoSortKey(a.mesAno) - parseMesAnoSortKey(b.mesAno));

  return {
    totalGeralEmpenhado: Math.round(totalGeralEmpenhado * 100) / 100,
    totalGeralPago: Math.round(totalGeralPago * 100) / 100,
    acoes,
    evolucaoAssistenciaMensal
  };
}
