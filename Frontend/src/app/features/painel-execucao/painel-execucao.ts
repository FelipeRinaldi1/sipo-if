import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexFill, ApexTooltip, ApexLegend, ApexGrid } from 'ng-apexcharts';
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
    MatProgressSpinnerModule,
    NgApexchartsModule
  ],
  templateUrl: './painel-execucao.html'
})
export class PainelExecucaoComponent implements OnInit {
  private despesasService = inject(DespesasService);

  resumo = signal<ResumoExecucao | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  displayedColumns: string[] = ['mesAno', 'empenhado', 'liquidado', 'pago', 'progresso'];

  // --- Dados para gráfico de área (AC-011) ---
  areaChartSeries = computed<ApexAxisChartSeries>(() => {
    const meses = this.resumo()?.evolucaoMensal ?? [];
    return [
      { name: 'Empenhado', data: meses.map(m => +(m.empenhado / 1000).toFixed(2)) },
      { name: 'Liquidado',  data: meses.map(m => +(m.liquidado  / 1000).toFixed(2)) },
      { name: 'Pago',       data: meses.map(m => +(m.pago       / 1000).toFixed(2)) },
    ];
  });

  areaChartCategories = computed<string[]>(() =>
    this.resumo()?.evolucaoMensal.map(m => m.mesAno) ?? []
  );

  areaChart: ApexChart = {
    type: 'area', height: 320, toolbar: { show: false }, fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 }
  };
  areaStroke: ApexStroke = { curve: 'smooth', width: 2 };
  areaFill: ApexFill = { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 100] } };
  areaDataLabels: ApexDataLabels = { enabled: false };
  areaColors = ['#006633', '#10b981', '#cc0000'];
  areaGrid: ApexGrid = { borderColor: '#f1f5f9', strokeDashArray: 4 };
  areaTooltip: ApexTooltip = { y: { formatter: (v: number) => `R$ ${(v * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}` } };
  areaLegend: ApexLegend = { position: 'top', horizontalAlign: 'right' };

  // --- Dados para gráfico de barras agrupadas (AC-012) ---
  barChartSeries = computed<ApexAxisChartSeries>(() => {
    const meses = this.resumo()?.evolucaoMensal ?? [];
    return [
      { name: 'Empenhado', data: meses.map(m => +(m.empenhado / 1000).toFixed(2)) },
      { name: 'Liquidado',  data: meses.map(m => +(m.liquidado  / 1000).toFixed(2)) },
      { name: 'Pago',       data: meses.map(m => +(m.pago       / 1000).toFixed(2)) },
    ];
  });

  barChart: ApexChart = {
    type: 'bar', height: 300, toolbar: { show: false }, fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 }
  };
  barDataLabels: ApexDataLabels = { enabled: false };
  barColors = ['#006633', '#10b981', '#cc0000'];
  barGrid: ApexGrid = { borderColor: '#f1f5f9', strokeDashArray: 4 };
  barTooltip: ApexTooltip = { y: { formatter: (v: number) => `R$ ${(v * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}` } };
  barLegend: ApexLegend = { position: 'top', horizontalAlign: 'right' };
  // --- Dados para gráfico de curva acumulada (AC-017) ---
  acumuladoChartSeries = computed<ApexAxisChartSeries>(() => {
    const meses = this.resumo()?.evolucaoMensal ?? [];
    let accEmpenhado = 0;
    let accLiquidado = 0;
    let accPago = 0;

    const empenhadoAcc: number[] = [];
    const liquidadoAcc: number[] = [];
    const pagoAcc: number[] = [];

    for (const m of meses) {
      accEmpenhado += m.empenhado;
      accLiquidado += m.liquidado;
      accPago += m.pago;

      empenhadoAcc.push(+(accEmpenhado / 1000).toFixed(2));
      liquidadoAcc.push(+(accLiquidado / 1000).toFixed(2));
      pagoAcc.push(+(accPago / 1000).toFixed(2));
    }

    return [
      { name: 'Empenhado Acumulado', data: empenhadoAcc },
      { name: 'Liquidado Acumulado', data: liquidadoAcc },
      { name: 'Pago Acumulado',      data: pagoAcc },
    ];
  });

  acumuladoChart: ApexChart = {
    type: 'line', height: 320, toolbar: { show: false }, fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 }
  };
  acumuladoStroke: ApexStroke = { curve: 'smooth', width: 3 };
  acumuladoColors = ['#006633', '#10b981', '#cc0000'];
  acumuladoGrid: ApexGrid = { borderColor: '#f1f5f9', strokeDashArray: 4 };
  acumuladoTooltip: ApexTooltip = { y: { formatter: (v: number) => `R$ ${(v * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}` } };
  acumuladoLegend: ApexLegend = { position: 'top', horizontalAlign: 'right' };

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
