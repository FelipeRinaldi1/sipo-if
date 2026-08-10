import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class DespesasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/despesas';

  getResumoExecucao(): Observable<ResumoExecucao> {
    return this.http.get<ResumoExecucao>(`${this.apiUrl}/resumo-execucao`);
  }
}
