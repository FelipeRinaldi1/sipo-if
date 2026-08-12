import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EvolucaoMensalItem {
  mesAno: string;
  empenhado: number;
  liquidado: number;
  pago: number;
  restosAPagarPagos: number;
}

export interface ResumoExecucao {
  totalEmpenhado: number;
  totalLiquidado: number;
  totalPago: number;
  totalRestosAPagarPagos: number;
  evolucaoMensal: EvolucaoMensalItem[];
}

export interface ItemAcaoResumo {
  codigoAcao: string;
  nomeAcao: string;
  totalEmpenhado: number;
  totalLiquidado: number;
  totalPago: number;
  porcentagemDoTotal: number;
}

export interface EvolucaoAssistenciaItem {
  codigoAcao: string;
  mesAno: string;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
}

export interface ResumoProgramaAcao {
  totalGeralEmpenhado: number;
  totalGeralPago: number;
  acoes: ItemAcaoResumo[];
  evolucaoAssistenciaMensal: EvolucaoAssistenciaItem[];
}

export interface TopFornecedorItem {
  favorecido: string;
  totalPago: number;
  quantidadeLancamentos: number;
  porcentagemDoTotal: number;
}

export interface ElementoDespesaItem {
  elemento: string;
  totalPago: number;
  quantidadeLancamentos: number;
  porcentagemDoTotal: number;
}

export interface ResumoFornecedores {
  totalGeral: number;
  topFornecedores: TopFornecedorItem[];
  elementosDespesa: ElementoDespesaItem[];
}

export interface DespesaDocumentoItem {
  id: string;
  data: string;
  documento: string;
  localizadorGasto: string;
  fase: string;
  especie: string;
  favorecido: string;
  valor: number;
  grupoDespesa: string;
  elementoDespesa: string;
}

export interface ResultadoPaginadoDocumentos {
  pagina: number;
  tamanhoPagina: number;
  totalRegistros: number;
  totalPaginas: number;
  itens: DespesaDocumentoItem[];
}

@Injectable({
  providedIn: 'root'
})
export class DespesasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/despesas';

  getResumoExecucao(): Observable<ResumoExecucao> {
    return this.http.get<ResumoExecucao>(`${this.apiUrl}/resumo-execucao`);
  }

  getResumoProgramaAcao(): Observable<ResumoProgramaAcao> {
    return this.http.get<ResumoProgramaAcao>(`${this.apiUrl}/programa-acao`);
  }

  getResumoFornecedores(): Observable<ResumoFornecedores> {
    return this.http.get<ResumoFornecedores>(`${this.apiUrl}/fornecedores`);
  }

  getDocumentosPaginado(busca?: string, pagina: number = 1, tamanhoPagina: number = 10): Observable<ResultadoPaginadoDocumentos> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanhoPagina', tamanhoPagina.toString());
    
    if (busca && busca.trim().length > 0) {
      params = params.set('busca', busca.trim());
    }

    return this.http.get<ResultadoPaginadoDocumentos>(`${this.apiUrl}/documentos`, { params });
  }
}
