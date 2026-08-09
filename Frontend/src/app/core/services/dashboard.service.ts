import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardPublicoData {
  anoSelecionado: number;
  totalEmpenhadoJacarei: number;
  totalLiquidadoJacarei: number;
  totalPagoJacarei: number;
  totalEmpenhadoGeralIfsp: number;
  totalLiquidadoGeralIfsp: number;
  totalPagoGeralIfsp: number;
  taxaExecucaoJacarei: number;
  anosDisponiveis: number[];
}

export interface StatusSincronizacaoData {
  ultimaSincronizacaoComSucessoUtc?: string;
  totalRegistrosUltimaSincronizacao?: number;
  ultimaFalhaUtc?: string;
  mensagemUltimoErro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000';

  getDashboardData(ano?: number): Observable<DashboardPublicoData> {
    let params = new HttpParams();
    if (ano) {
      params = params.set('ano', ano.toString());
    }
    return this.http.get<DashboardPublicoData>(`${this.apiUrl}/transparencia/dashboard`, { params });
  }

  getStatusSincronizacao(): Observable<StatusSincronizacaoData> {
    return this.http.get<StatusSincronizacaoData>(`${this.apiUrl}/sincronizacao/status`);
  }

  exportarCsv(ano?: number): void {
    const anoFiltro = ano ?? 2022;
    window.open(`${this.apiUrl}/transparencia/exportar-csv?ano=${anoFiltro}`, '_blank');
  }
}
