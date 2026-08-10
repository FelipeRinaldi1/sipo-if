import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DespesasService, ResumoExecucao, EvolucaoMensalItem } from '../../core/services/despesas.service';

@Component({
  selector: 'app-painel-execucao',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './painel-execucao.html'
})
export class PainelExecucaoComponent implements OnInit {
  private despesasService = inject(DespesasService);
  
  resumo = signal<ResumoExecucao | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  displayedColumns: string[] = ['mesAno', 'empenhado', 'liquidado', 'pago', 'progresso'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.despesasService.getResumoExecucao().subscribe({
      next: (data) => {
        this.resumo.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar resumo de execução:', err);
        this.error.set('Não foi possível carregar os dados financeiros.');
        this.loading.set(false);
      }
    });
  }

  getExecucaoPorcentagem(pago: number, empenhado: number): number {
    if (!empenhado || empenhado === 0) return 0;
    return Math.min(100, Math.round((pago / empenhado) * 100));
  }
}
