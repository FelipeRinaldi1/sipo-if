import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';

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

export interface EvolucaoMensalFornecedorItem {
  mesAno: string;
  valorPago: number;
  quantidadeLancamentos: number;
}

export interface TopFornecedorItem {
  favorecido: string;
  totalPago: number;
  quantidadeLancamentos: number;
  porcentagemDoTotal: number;
  evolucaoMensal?: EvolucaoMensalFornecedorItem[];
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
  todosFornecedores?: TopFornecedorItem[];
  elementosDespesa: ElementoDespesaItem[];
}

export interface DespesaDocumentoItem {
  id?: string;
  data: string;
  documento: string;
  localizadorGasto: string;
  fase: string;
  especie: string;
  favorecido: string;
  ufFavorecido?: string;
  ug?: string;
  unidadeOrcamentaria?: string;
  orgao?: string;
  orgaoSuperior?: string;
  valor: number;
  grupoDespesa: string;
  elementoDespesa: string;
  modalidadeDespesa?: string;
  planoOrcamentario?: string;
  autorEmenda?: string;
  funcao?: string;
  subfuncao?: string;
  subtitulo?: string;
  programaGoverno?: string;
  acao?: string;
}

export interface ResultadoPaginadoDocumentos {
  pagina: number;
  tamanhoPagina: number;
  totalRegistros: number;
  totalPaginas: number;
  itens: DespesaDocumentoItem[];
}

export interface DocumentosRawJson {
  total: number;
  itens: DespesaDocumentoItem[];
}

@Injectable({
  providedIn: 'root'
})
export class DespesasService {
  private http = inject(HttpClient);
  private basePath = 'assets/data';
  private anoSubject = new BehaviorSubject<string>('2025');
  readonly ano$ = this.anoSubject.asObservable();

  setAno(ano: string): void {
    this.anoSubject.next(ano);
  }

  getAnoAtual(): string {
    return this.anoSubject.getValue();
  }

  getAnosDisponiveis(): Observable<string[]> {
    return this.http.get<string[]>(`${this.basePath}/anos.json`);
  }

  getResumoExecucao(ano?: string): Observable<ResumoExecucao> {
    const selectedAno = ano || this.getAnoAtual();
    const path = selectedAno ? `${this.basePath}/${selectedAno}/resumo-execucao.json` : `${this.basePath}/resumo-execucao.json`;
    return this.http.get<ResumoExecucao>(path);
  }

  getResumoProgramaAcao(ano?: string): Observable<ResumoProgramaAcao> {
    const selectedAno = ano || this.getAnoAtual();
    const path = selectedAno ? `${this.basePath}/${selectedAno}/programa-acao.json` : `${this.basePath}/programa-acao.json`;
    return this.http.get<ResumoProgramaAcao>(path);
  }

  getResumoFornecedores(ano?: string): Observable<ResumoFornecedores> {
    const selectedAno = ano || this.getAnoAtual();
    const path = selectedAno ? `${this.basePath}/${selectedAno}/fornecedores.json` : `${this.basePath}/fornecedores.json`;
    return this.http.get<ResumoFornecedores>(path);
  }

  getDocumentosPaginado(busca?: string, pagina: number = 1, tamanhoPagina: number = 10, ano?: string): Observable<ResultadoPaginadoDocumentos> {
    const selectedAno = ano || this.getAnoAtual();
    const path = selectedAno ? `${this.basePath}/${selectedAno}/documentos.json` : `${this.basePath}/documentos.json`;
    
    return this.http.get<DocumentosRawJson>(path).pipe(
      map(data => {
        let filtrados = data.itens || [];
        if (busca && busca.trim().length > 0) {
          const termo = busca.trim().toLowerCase();
          filtrados = filtrados.filter(item =>
            (item.favorecido && item.favorecido.toLowerCase().includes(termo)) ||
            (item.documento && item.documento.toLowerCase().includes(termo)) ||
            (item.elementoDespesa && item.elementoDespesa.toLowerCase().includes(termo))
          );
        }

        const totalRegistros = filtrados.length;
        const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina) || 1;
        const inicio = (pagina - 1) * tamanhoPagina;
        const itensPaginados = filtrados.slice(inicio, inicio + tamanhoPagina);

        return {
          pagina,
          tamanhoPagina,
          totalRegistros,
          totalPaginas,
          itens: itensPaginados
        };
      })
    );
  }
}


