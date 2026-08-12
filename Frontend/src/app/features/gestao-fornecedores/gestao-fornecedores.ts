import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexTooltip, ApexPlotOptions, ApexLegend, ApexGrid, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { DespesasService, ResumoFornecedores } from '../../core/services/despesas.service';

@Component({
  selector: 'app-gestao-fornecedores',
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
  templateUrl: './gestao-fornecedores.html'
})
export class GestaoFornecedoresComponent implements OnInit {
  private despesasService = inject(DespesasService);

  resumo = signal<ResumoFornecedores | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  displayedColumnsTop: string[] = ['posicao', 'favorecido', 'quantidade', 'totalPago', 'porcentagem'];
  displayedColumnsElementos: string[] = ['elemento', 'quantidade', 'totalPago', 'porcentagem'];

  // --- Gráfico Top 5 fornecedores barras horizontais (AC-015) ---
  top5Series = computed<ApexAxisChartSeries>(() => {
    const top = this.resumo()?.topFornecedores ?? [];
    return [{ name: 'Valor Pago', data: top.map(f => +(f.totalPago / 1000).toFixed(2)) }];
  });

  top5Categories = computed<string[]>(() => {
    const top = this.resumo()?.topFornecedores ?? [];
    return top.map(f => {
      // Remove CNPJ e mantém só o nome
      const nome = f.favorecido.includes(' - ') ? f.favorecido.split(' - ').slice(1).join(' - ') : f.favorecido;
      return nome.length > 35 ? nome.substring(0, 35) + '…' : nome;
    });
  });

  top5Chart: ApexChart = {
    type: 'bar', height: 280, toolbar: { show: false }, fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 }
  };
  top5PlotOptions: ApexPlotOptions = { bar: { horizontal: true, borderRadius: 4, dataLabels: { position: 'top' } } };
  top5DataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (v: number) => `R$ ${(v * 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`,
    offsetX: 6, style: { fontSize: '11px', colors: ['#64748b'] }
  };
  top5Colors = ['#006633'];
  top5Grid: ApexGrid = { borderColor: '#f1f5f9', xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } };
  top5Tooltip: ApexTooltip = { y: { formatter: (v: number) => `R$ ${(v * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}` } };
  top5Xaxis: ApexXAxis = { labels: { formatter: (v: string) => `R$ ${(+v).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil` } };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.despesasService.getResumoFornecedores().subscribe({
      next: (data) => {
        this.resumo.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados de fornecedores:', err);
        this.error.set('Não foi possível carregar os dados de fornecedores e contratos.');
        this.loading.set(false);
      }
    });
  }
}
