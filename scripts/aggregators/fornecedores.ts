import type { DespesaDocumento, ResumoFornecedores, TopFornecedorItem, ElementoDespesaItem } from '../types.ts';

function extrairMesAno(dataStr?: string): string {
  if (!dataStr || !dataStr.trim()) return '01/2025';
  const trimmed = dataStr.trim();
  const parts = trimmed.split('/');
  if (parts.length === 3) {
    return `${parts[1].padStart(2, '0')}/${parts[2]}`;
  }
  const isoParts = trimmed.split('-');
  if (isoParts.length === 3) {
    return `${isoParts[1].padStart(2, '0')}/${isoParts[0]}`;
  }
  return trimmed;
}

export function isIfspCampusJacarei(favorecido?: string): boolean {
  if (!favorecido) return false;
  const f = favorecido.toUpperCase().trim();
  return f.includes('158716') || f.includes('IFSP - CAMPUS JACAREI');
}

export function isElemento18(elemento?: string): boolean {
  if (!elemento) return false;
  return elemento.trim().startsWith('18');
}

export function aggregateFornecedores(documentos: DespesaDocumento[]): ResumoFornecedores {
  const temPagamento = documentos.some(d => d.fase && d.fase.toLowerCase() === 'pagamento');
  const docsFiltrados = temPagamento
    ? documentos.filter(d => d.fase && d.fase.toLowerCase() === 'pagamento')
    : documentos;

  const docsFornecedores = docsFiltrados.filter(d => !isIfspCampusJacarei(d.favorecido));
  let totalFornecedores = 0;
  for (const d of docsFornecedores) {
    totalFornecedores += d.valor;
  }

  const fornecedoresMap = new Map<
    string,
    {
      total: number;
      count: number;
      meses: Map<string, { total: number; count: number }>;
    }
  >();

  for (const d of docsFornecedores) {
    const nome = d.favorecido && d.favorecido.trim() ? d.favorecido.trim() : 'Sem informação';
    let f = fornecedoresMap.get(nome);
    if (!f) {
      f = { total: 0, count: 0, meses: new Map() };
      fornecedoresMap.set(nome, f);
    }
    f.total += d.valor;
    f.count += 1;

    const mesAno = extrairMesAno(d.data);
    let m = f.meses.get(mesAno);
    if (!m) {
      m = { total: 0, count: 0 };
      f.meses.set(mesAno, m);
    }
    m.total += d.valor;
    m.count += 1;
  }

  const todosFornecedores: TopFornecedorItem[] = Array.from(fornecedoresMap.entries())
    .map(([favorecido, val]) => {
      const pct = totalFornecedores > 0 ? Math.round((val.total / totalFornecedores) * 10000) / 100 : 0;
      const evolucaoMensal = Array.from(val.meses.entries())
        .map(([mesAno, mesVal]) => ({
          mesAno,
          valorPago: Math.round(mesVal.total * 100) / 100,
          quantidadeLancamentos: mesVal.count
        }))
        .sort((a, b) => {
          const [mA, yA] = a.mesAno.split('/').map(Number);
          const [mB, yB] = b.mesAno.split('/').map(Number);
          if (yA !== yB) return yA - yB;
          return mA - mB;
        });

      return {
        favorecido,
        totalPago: Math.round(val.total * 100) / 100,
        quantidadeLancamentos: val.count,
        porcentagemDoTotal: pct,
        evolucaoMensal
      };
    })
    .sort((a, b) => b.totalPago - a.totalPago);

  const topFornecedores = todosFornecedores.slice(0, 5);

  const docsCategorias = docsFiltrados.filter(d => !isElemento18(d.elementoDespesa));
  let totalCategorias = 0;
  for (const d of docsCategorias) {
    totalCategorias += d.valor;
  }

  const elementosMap = new Map<string, { total: number; count: number }>();
  for (const d of docsCategorias) {
    const elemento = d.elementoDespesa && d.elementoDespesa.trim() ? d.elementoDespesa.trim() : 'Sem informação';
    let e = elementosMap.get(elemento);
    if (!e) {
      e = { total: 0, count: 0 };
      elementosMap.set(elemento, e);
    }
    e.total += d.valor;
    e.count += 1;
  }

  const elementosDespesa: ElementoDespesaItem[] = Array.from(elementosMap.entries())
    .map(([elemento, val]) => {
      const pct = totalCategorias > 0 ? Math.round((val.total / totalCategorias) * 10000) / 100 : 0;
      return {
        elemento,
        totalPago: Math.round(val.total * 100) / 100,
        quantidadeLancamentos: val.count,
        porcentagemDoTotal: pct
      };
    })
    .sort((a, b) => b.totalPago - a.totalPago);

  return {
    totalGeral: Math.round(totalFornecedores * 100) / 100,
    topFornecedores,
    todosFornecedores,
    elementosDespesa
  };
}
