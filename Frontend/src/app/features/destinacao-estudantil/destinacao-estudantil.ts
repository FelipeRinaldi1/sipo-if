import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexPlotOptions, ApexLegend, ApexGrid } from 'ng-apexcharts';
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
    MatProgressSpinnerModule,
    NgApexchartsModule
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

  // --- Gráfico comparativo Assistência vs. Funcionamento (AC-013) ---
  compChartSeries = computed<ApexAxisChartSeries>(() => {
    const r = this.resumo();
    if (!r) return [];
    const labels = r.acoes.map(a => a.nomeAcao.length > 40 ? a.nomeAcao.substring(0, 40) + '…' : a.nomeAcao);
    return [
      { name: 'Empenhado', data: r.acoes.map(a => +(a.totalEmpenhado / 1000).toFixed(2)) },
      { name: 'Pago',      data: r.acoes.map(a => +(a.totalPago      / 1000).toFixed(2)) },
    ];
  });

  compChartCategories = computed<string[]>(() => {
    const r = this.resumo();
    if (!r) return [];
    return r.acoes.map(a => {
      const nome = a.nomeAcao.split(' - ')[0] ?? a.nomeAcao;
      return nome.length > 30 ? nome.substring(0, 30) + '…' : nome;
    });
  });

  compChart: ApexChart = {
    type: 'bar', height: 280, toolbar: { show: false }, fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 }
  };
  compDataLabels: ApexDataLabels = { enabled: false };
  compColors = ['#6366f1', '#10b981'];
  compGrid: ApexGrid = { borderColor: '#f1f5f9', strokeDashArray: 4 };
  compTooltip: ApexTooltip = { y: { formatter: (v: number) => `R$ ${(v * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}` } };
  compLegend: ApexLegend = { position: 'top', horizontalAlign: 'right' };
  compPlotOptions: ApexPlotOptions = { bar: { horizontal: false, columnWidth: '50%', borderRadius: 4 } };

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
