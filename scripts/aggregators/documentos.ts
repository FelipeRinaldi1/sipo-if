import type { DespesaDocumento, DocumentosJson } from '../types.ts';

export function aggregateDocumentos(documentos: DespesaDocumento[]): DocumentosJson {
  return {
    total: documentos.length,
    itens: documentos
  };
}
