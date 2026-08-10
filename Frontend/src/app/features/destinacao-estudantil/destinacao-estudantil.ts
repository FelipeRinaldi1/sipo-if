import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DespesasService, ResumoProgramaAcao, ItemAcaoResumo } from '../../core/services/despesas.service';

@Component({
  selector: 'app-destinacao-estudantil',
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
  templateUrl: './destinacao-estudantil.html'
})
export class DestinacaoEstudantilComponent implements OnInit {
  private despesasService = inject(DespesasService);

  resumo = signal<ResumoProgramaAcao | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  displayedColumnsAcoes: string[] = ['codigoAcao', 'nomeAcao', 'totalPago', 'porcentagemDoTotal'];
  displayedColumnsEvolucao: string[] = ['mesAno', 'valorEmpenhado', 'valorPago'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.despesasService.getResumoProgramaAcao().subscribe({
      next: (data) => {
        this.resumo.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar destinação orçamentária:', err);
        this.error.set('Não foi possível carregar os dados de programas e ações.');
        this.loading.set(false);
      }
    });
  }

  getAssistenciaTotal(): number {
    const r = this.resumo();
    if (!r) return 0;
    const item = r.acoes.find(a => a.codigoAcao === '2994');
    return item ? item.totalPago : 0;
  }

  getFuncionamentoTotal(): number {
    const r = this.resumo();
    if (!r) return 0;
    const item = r.acoes.find(a => a.codigoAcao === '20RL');
    return item ? item.totalPago : 0;
  }

  getAssistenciaPorcentagem(): number {
    const total = this.resumo()?.totalGeralPago || 0;
    if (total === 0) return 0;
    return Math.round((this.getAssistenciaTotal() / total) * 100);
  }
}
