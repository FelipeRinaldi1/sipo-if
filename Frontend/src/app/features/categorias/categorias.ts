import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgApexchartsModule, ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexTooltip, ApexLegend, ApexResponsive } from 'ng-apexcharts';
import { DespesasService, ResumoFornecedores } from '../../core/services/despesas.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgApexchartsModule
  ],
  templateUrl: './categorias.html'
})
export class CategoriasComponent implements OnInit {
  private despesasService = inject(DespesasService);

  resumo = signal<ResumoFornecedores | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // --- Gráfico Donut — Distribuição por Elemento de Despesa (AC-014) ---
  donutSeries = computed<ApexNonAxisChartSeries>(() => {
    const elementos = this.resumo()?.elementosDespesa ?? [];
    return elementos.map(e => +e.totalPago.toFixed(2));
  });

  donutLabels = computed<string[]>(() => {
    const elementos = this.resumo()?.elementosDespesa ?? [];
    return elementos.map(e => {
      // Remove código numérico e mantém só o nome: "18 - Auxílio..." → "Auxílio..."
      const nome = e.elemento.includes(' - ') ? e.elemento.split(' - ').slice(1).join(' - ') : e.elemento;
      return nome.length > 40 ? nome.substring(0, 40) + '…' : nome;
    });
  });

  donutChart: ApexChart = {
    type: 'donut', height: 400, fontFamily: 'inherit',
    animations: { enabled: true, speed: 700 }
  };
  donutDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
    style: { fontSize: '12px' }
  };
  donutTooltip: ApexTooltip = {
    y: { formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  };
  donutLegend: ApexLegend = {
    position: 'bottom', horizontalAlign: 'center', fontSize: '12px',
    itemMargin: { horizontal: 8, vertical: 4 }
  };
  donutColors = [
    '#006633', '#cc0000', '#10b981', '#f59e0b', '#004d26',
    '#990000', '#06b6d4', '#84cc16', '#f97316', '#ec4899'
  ];
  donutResponsive: ApexResponsive[] = [
    { breakpoint: 768, options: { chart: { height: 320 }, legend: { position: 'bottom' } } }
  ];

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
        console.error('Erro ao carregar categorias de despesa:', err);
        this.error.set('Não foi possível carregar os dados de categorias.');
        this.loading.set(false);
      }
    });
  }

  get totalGeral(): number {
    return this.resumo()?.totalGeral ?? 0;
  }
}
