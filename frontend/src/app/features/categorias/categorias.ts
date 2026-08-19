import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexTooltip,
  ApexLegend,
  ApexResponsive,
  ApexPlotOptions,
} from 'ng-apexcharts';
import {
  DespesasService,
  ResumoFornecedores,
  ElementoDespesaItem,
} from '../../core/services/despesas.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgApexchartsModule,
  ],
  templateUrl: './categorias.html',
})
export class CategoriasComponent implements OnInit {
  private despesasService = inject(DespesasService);

  resumo = signal<ResumoFornecedores | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  selectedElementos = signal<string[]>([]);

  readonly baseColors = [
    '#006633',
    '#cc0000',
    '#10b981',
    '#f59e0b',
    '#004d26',
    '#990000',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#ec4899',
    '#6366f1',
    '#8b5cf6',
    '#14b8a6',
    '#e11d48',
    '#d97706',
  ];

  extrairCodigoNumerico(elemento: string): number {
    const match = elemento.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 999999;
  }

  elementosOrdenados = computed<ElementoDespesaItem[]>(() => {
    const todos = this.resumo()?.elementosDespesa ?? [];
    return [...todos].sort((a, b) => {
      const codA = this.extrairCodigoNumerico(a.elemento);
      const codB = this.extrairCodigoNumerico(b.elemento);
      if (codA !== codB) return codA - codB;
      return a.elemento.localeCompare(b.elemento);
    });
  });

  getColorForIndex(index: number): string {
    return this.baseColors[index % this.baseColors.length];
  }

  getColorForElemento(elementoNome: string): string {
    const todos = this.elementosOrdenados();
    const idx = todos.findIndex((e) => e.elemento === elementoNome);
    return idx >= 0 ? this.getColorForIndex(idx) : this.baseColors[0];
  }

  elementosFiltrados = computed<ElementoDespesaItem[]>(() => {
    const ordenados = this.elementosOrdenados();
    const selecionados = new Set(this.selectedElementos());
    return ordenados.filter((e) => selecionados.has(e.elemento));
  });

  totalFiltrado = computed<number>(() => {
    return this.elementosFiltrados().reduce((acc, curr) => acc + curr.totalPago, 0);
  });

  maiorCategoria = computed<ElementoDespesaItem | null>(() => {
    const list = this.elementosFiltrados();
    if (list.length === 0) return null;
    return [...list].sort((a, b) => b.totalPago - a.totalPago)[0];
  });

  ticketMedioCategoria = computed<number>(() => {
    const count = this.elementosFiltrados().length;
    return count > 0 ? this.totalFiltrado() / count : 0;
  });

  porcentagemDoTotalCatalogo = computed<number>(() => {
    const totalCatalogo = this.resumo()?.totalGeral ?? 0;
    return totalCatalogo > 0 ? (this.totalFiltrado() / totalCatalogo) * 100 : 0;
  });

  isAllSelected = computed<boolean>(() => {
    const todos = this.resumo()?.elementosDespesa ?? [];
    return todos.length > 0 && this.selectedElementos().length === todos.length;
  });

  isIndeterminate = computed<boolean>(() => {
    const todos = this.resumo()?.elementosDespesa ?? [];
    const selCount = this.selectedElementos().length;
    return selCount > 0 && selCount < todos.length;
  });

  donutSeries = computed<ApexNonAxisChartSeries>(() => {
    return this.elementosFiltrados().map((e) => +e.totalPago.toFixed(2));
  });

  donutLabels = computed<string[]>(() => {
    return this.elementosFiltrados().map((e) => {
      const nome = e.elemento.includes(' - ')
        ? e.elemento.split(' - ').slice(1).join(' - ')
        : e.elemento;
      return nome.length > 40 ? nome.substring(0, 40) + '…' : nome;
    });
  });

  donutColors = computed<string[]>(() => {
    return this.elementosFiltrados().map((e) => this.getColorForElemento(e.elemento));
  });

  donutChart: ApexChart = {
    type: 'donut',
    width: '100%',
    height: 380,
    fontFamily: 'inherit',
    animations: { enabled: true, speed: 500 },
  };

  donutDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
    style: { fontSize: '12px' },
  };

  donutTooltip: ApexTooltip = {
    y: {
      formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
  };

  donutLegend: ApexLegend = {
    show: false,
  };

  donutPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '12px',
            color: '#64748b',
            offsetY: -8,
          },
          value: {
            show: true,
            fontSize: '16px',
            fontWeight: 700,
            color: '#0f172a',
            offsetY: 2,
            formatter: (val: string) => {
              const num = Number(val);
              if (isNaN(num)) return val;
              return num >= 1000000
                ? `R$ ${(num / 1000000).toFixed(2)}M`
                : num >= 1000
                  ? `R$ ${(num / 1000).toFixed(0)} mil`
                  : `R$ ${num.toFixed(0)}`;
            },
          },
          total: {
            show: true,
            label: 'Total Filtrado',
            fontSize: '11px',
            color: '#64748b',
            formatter: () => {
              const total = this.totalFiltrado();
              return total >= 1000000
                ? `R$ ${(total / 1000000).toFixed(2)}M`
                : total >= 1000
                  ? `R$ ${(total / 1000).toFixed(0)} mil`
                  : `R$ ${total.toFixed(0)}`;
            },
          },
        },
      },
    },
  };

  donutResponsive: ApexResponsive[] = [
    { breakpoint: 640, options: { chart: { height: 320 }, legend: { show: false } } },
  ];

  ngOnInit(): void {
    this.despesasService.ano$.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.loading.set(true);
    this.despesasService.getResumoFornecedores().subscribe({
      next: (data) => {
        this.resumo.set(data);
        if (data?.elementosDespesa) {
          this.selectedElementos.set(data.elementosDespesa.map((e) => e.elemento));
        }
        this.selectedSegmentos.set(this.todosSegmentos().map((s) => s.nome));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar categorias de despesa:', err);
        this.error.set('Não foi possível carregar os dados de categorias.');
        this.loading.set(false);
      },
    });
  }

  isElementoSelected(elemento: string): boolean {
    return this.selectedElementos().includes(elemento);
  }

  toggleElemento(elemento: string): void {
    const current = this.selectedElementos();
    if (current.includes(elemento)) {
      this.selectedElementos.set(current.filter((e) => e !== elemento));
    } else {
      this.selectedElementos.set([...current, elemento]);
    }
  }

  toggleSelectAll(): void {
    const todos = this.resumo()?.elementosDespesa ?? [];
    if (this.isAllSelected()) {
      this.selectedElementos.set([]);
    } else {
      this.selectedElementos.set(todos.map((e) => e.elemento));
    }
  }

  selectAll(): void {
    const todos = this.resumo()?.elementosDespesa ?? [];
    this.selectedElementos.set(todos.map((e) => e.elemento));
  }

  deselectAll(): void {
    this.selectedElementos.set([]);
  }

  selectedSegmentos = signal<string[]>([]);

  readonly segmentColors = [
    '#006633',
    '#0891b2',
    '#4f46e5',
    '#f59e0b',
    '#10b981',
    '#e11d48',
    '#8b5cf6',
    '#d97706',
    '#06b6d4',
    '#64748b',
  ];

  categorizarSegmento(favorecido: string): string {
    const f = (favorecido || '').toUpperCase();
    if (f.includes('IFSP') || f.includes('158716') || f.includes('ESTUDANT'))
      return 'Bolsas & Apoio Estudantil';
    if (
      f.includes('SEGURANCA') ||
      f.includes('VIGILANCIA') ||
      f.includes('RAGNAR') ||
      f.includes('REAK') ||
      f.includes('FORCA E APOIO') ||
      f.includes('SAFEPRO')
    )
      return 'Vigilância & Segurança Patrimonial';
    if (
      f.includes('LIMPEZA') ||
      f.includes('CONSERVACAO') ||
      f.includes('TERCEIRIZACAO') ||
      f.includes('POLO') ||
      f.includes('MAXIMOS') ||
      f.includes('CONSOLIDEZ') ||
      f.includes('TJ ') ||
      f.includes('PAISAGISMO')
    )
      return 'Limpeza, Manutenção & Jardinagem';
    if (
      f.includes('EDP') ||
      f.includes('ENERGIA') ||
      f.includes('SAAE') ||
      f.includes('AGUA') ||
      f.includes('SABESP')
    )
      return 'Concessionárias Públicas (Luz/Água)';
    if (
      f.includes('EQUIPAMENTOS') ||
      f.includes('COZIL') ||
      f.includes('TECNOLOGIA') ||
      f.includes('DELL') ||
      f.includes('POSITIVO') ||
      f.includes('INFORMATICA') ||
      f.includes('COMPUTADORES') ||
      f.includes('ONDA PRO') ||
      f.includes('PONTTO') ||
      f.includes('LIDER NOTEBOOKS')
    )
      return 'Tecnologia & Equipamentos';
    return 'Outros Serviços & Materiais';
  }

  todosSegmentos = computed(() => {
    const lista = this.resumo()?.todosFornecedores || this.resumo()?.topFornecedores || [];
    const totalGeral = this.resumo()?.totalGeral || 1;
    const map = new Map<string, { total: number; count: number }>();

    for (const item of lista) {
      const seg = this.categorizarSegmento(item.favorecido);
      const atual = map.get(seg) || { total: 0, count: 0 };
      atual.total += item.totalPago;
      atual.count += 1;
      map.set(seg, atual);
    }

    return Array.from(map.entries())
      .map(([nome, val]) => ({
        nome,
        total: Math.round(val.total * 100) / 100,
        quantidadeFornecedores: val.count,
        porcentagem: totalGeral > 0 ? (val.total / totalGeral) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  });

  segmentosFiltrados = computed(() => {
    const todos = this.todosSegmentos();
    const selecionados = new Set(this.selectedSegmentos());
    return todos.filter((s) => selecionados.has(s.nome));
  });

  totalSegmentosFiltrado = computed(() => {
    return this.segmentosFiltrados().reduce((acc, curr) => acc + curr.total, 0);
  });

  isAllSegmentosSelected = computed<boolean>(() => {
    const todos = this.todosSegmentos();
    return todos.length > 0 && this.selectedSegmentos().length === todos.length;
  });

  isSegmentosIndeterminate = computed<boolean>(() => {
    const todos = this.todosSegmentos();
    const selCount = this.selectedSegmentos().length;
    return selCount > 0 && selCount < todos.length;
  });

  getColorForSegmento(nome: string): string {
    const todos = this.todosSegmentos();
    const idx = todos.findIndex((s) => s.nome === nome);
    return idx >= 0 ? this.segmentColors[idx % this.segmentColors.length] : this.segmentColors[0];
  }

  isSegmentoSelected(nome: string): boolean {
    return this.selectedSegmentos().includes(nome);
  }

  toggleSegmento(nome: string): void {
    const current = this.selectedSegmentos();
    if (current.includes(nome)) {
      this.selectedSegmentos.set(current.filter((s) => s !== nome));
    } else {
      this.selectedSegmentos.set([...current, nome]);
    }
  }

  toggleSelectAllSegmentos(): void {
    const todos = this.todosSegmentos();
    if (this.isAllSegmentosSelected()) {
      this.selectedSegmentos.set([]);
    } else {
      this.selectedSegmentos.set(todos.map((s) => s.nome));
    }
  }

  selectAllSegmentos(): void {
    const todos = this.todosSegmentos();
    this.selectedSegmentos.set(todos.map((s) => s.nome));
  }

  deselectAllSegmentos(): void {
    this.selectedSegmentos.set([]);
  }

  donutSegmentosSeries = computed<ApexNonAxisChartSeries>(() => {
    return this.segmentosFiltrados().map((s) => +s.total.toFixed(2));
  });

  donutSegmentosLabels = computed<string[]>(() => {
    return this.segmentosFiltrados().map((s) => s.nome);
  });

  donutSegmentosColors = computed<string[]>(() => {
    return this.segmentosFiltrados().map((s) => this.getColorForSegmento(s.nome));
  });

  donutSegmentosChart: ApexChart = {
    type: 'donut',
    width: '100%',
    height: 380,
    fontFamily: 'inherit',
    animations: { enabled: true, speed: 500 },
  };

  donutSegmentosDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
    style: { fontSize: '12px' },
  };

  donutSegmentosTooltip: ApexTooltip = {
    y: {
      formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
  };

  donutSegmentosLegend: ApexLegend = {
    show: false,
  };

  donutSegmentosPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '12px',
            color: '#64748b',
            offsetY: -8,
          },
          value: {
            show: true,
            fontSize: '16px',
            fontWeight: 700,
            color: '#0f172a',
            offsetY: 2,
            formatter: (val: string) => {
              const num = Number(val);
              if (isNaN(num)) return val;
              return num >= 1000000
                ? `R$ ${(num / 1000000).toFixed(2)}M`
                : num >= 1000
                  ? `R$ ${(num / 1000).toFixed(0)} mil`
                  : `R$ ${num.toFixed(0)}`;
            },
          },
          total: {
            show: true,
            label: 'Total Setores',
            fontSize: '11px',
            color: '#64748b',
            formatter: () => {
              const total = this.totalSegmentosFiltrado();
              return total >= 1000000
                ? `R$ ${(total / 1000000).toFixed(2)}M`
                : total >= 1000
                  ? `R$ ${(total / 1000).toFixed(0)} mil`
                  : `R$ ${total.toFixed(0)}`;
            },
          },
        },
      },
    },
  };

  donutSegmentosResponsive: ApexResponsive[] = [
    { breakpoint: 640, options: { chart: { height: 320 }, legend: { show: false } } },
  ];

  get totalGeral(): number {
    return this.resumo()?.totalGeral ?? 0;
  }
}
