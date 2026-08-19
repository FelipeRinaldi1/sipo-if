import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexTooltip,
  ApexPlotOptions,
  ApexLegend,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexFill,
  ApexMarkers,
} from 'ng-apexcharts';
import {
  DespesasService,
  ResumoFornecedores,
  TopFornecedorItem,
} from '../../core/despesas.service';

@Component({
  selector: 'app-gestao-fornecedores',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatTooltipModule,
    NgApexchartsModule,
  ],
  templateUrl: './gestao-fornecedores.html',
})
export class GestaoFornecedoresComponent implements OnInit {
  private despesasService = inject(DespesasService);

  resumo = signal<ResumoFornecedores | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  maiorFornecedor = computed(() => {
    const top = this.resumo()?.topFornecedores ?? [];
    return top.length > 0 ? top[0] : null;
  });

  somaTop5 = computed(() => {
    const top = (this.resumo()?.topFornecedores ?? []).slice(0, 5);
    const valor = top.reduce((acc, curr) => acc + curr.totalPago, 0);
    const totalGeral = this.resumo()?.totalGeral ?? 0;
    const pct = totalGeral > 0 ? (valor / totalGeral) * 100 : 0;
    return { valor, pct };
  });

  extrairNomeFavorecido(favorecido: string, maxLen = 35): string {
    const nome = favorecido.includes(' - ')
      ? favorecido.split(' - ').slice(1).join(' - ')
      : favorecido;
    return nome.length > maxLen ? nome.substring(0, maxLen) + '…' : nome;
  }

  concentracaoData = computed(() => {
    const lista = this.resumo()?.todosFornecedores || this.resumo()?.topFornecedores || [];
    const totalGeral = this.resumo()?.totalGeral ?? 0;
    const topEmpresas = lista.slice(0, 12);
    const somaTop = topEmpresas.reduce((acc, curr) => acc + curr.totalPago, 0);
    const demais = Math.max(0, totalGeral - somaTop);

    const categories: string[] = [];
    const values: number[] = [];

    for (const f of topEmpresas) {
      categories.push(this.extrairNomeFavorecido(f.favorecido, 45));
      values.push(+f.totalPago.toFixed(2));
    }

    if (demais > 0) {
      categories.push('Demais Fornecedores / Outros');
      values.push(+demais.toFixed(2));
    }

    return { categories, values };
  });

  concentracaoSeries = computed<ApexAxisChartSeries>(() => {
    const data = this.concentracaoData();
    return [
      {
        name: 'Valor Recebido',
        data: data.values,
      },
    ];
  });

  concentracaoCategories = computed<string[]>(() => this.concentracaoData().categories);

  concentracaoChart: ApexChart = {
    type: 'bar',
    width: '100%',
    height: 520,
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
    fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 },
  };

  concentracaoResponsive = [
    {
      breakpoint: 640,
      options: {
        chart: {
          height: 560,
        },
        plotOptions: {
          bar: {
            barHeight: '75%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '10px',
              fontWeight: 500,
            },
            maxWidth: 140,
          },
        },
        dataLabels: {
          style: {
            fontSize: '10px',
          },
          offsetX: 6,
        },
      },
    },
  ];

  concentracaoPlotOptions: ApexPlotOptions = {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '65%',
      distributed: true,
      dataLabels: {
        position: 'top',
      },
    },
  };

  concentracaoColors = [
    '#006633',
    '#0891b2',
    '#2563eb',
    '#7c3aed',
    '#c026d3',
    '#e11d48',
    '#ea580c',
    '#d97706',
    '#65a30d',
    '#10b981',
    '#0d9488',
    '#0284c7',
    '#64748b',
  ];

  concentracaoGrid: ApexGrid = {
    borderColor: '#f1f5f9',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  };

  concentracaoXaxis: ApexXAxis = {
    labels: {
      formatter: (val: string) => {
        const num = Number(val);
        if (isNaN(num)) return val;
        if (num >= 1000000) return `R$ ${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `R$ ${(num / 1000).toFixed(0)}k`;
        return `R$ ${num}`;
      },
      style: { fontSize: '11px', colors: '#64748b' },
    },
  };

  concentracaoYaxis: ApexYAxis = {
    labels: {
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: '#334155',
      },
      maxWidth: 240,
    },
  };

  concentracaoLegend: ApexLegend = {
    show: false,
  };

  concentracaoTooltip: ApexTooltip = {
    theme: 'light',
    y: {
      formatter: (val: number) => {
        const total = this.resumo()?.totalGeral || 1;
        const pct = ((val / total) * 100).toFixed(2);
        return `${val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${pct}% do total)`;
      },
    },
  };

  concentracaoDataLabels: ApexDataLabels = {
    enabled: true,
    offsetX: 10,
    style: {
      fontSize: '12px',
      fontWeight: 'bold',
      colors: ['#334155'],
    },
    formatter: (val: number) => {
      const total = this.resumo()?.totalGeral || 1;
      const pct = ((val / total) * 100).toFixed(1);
      const formattedVal =
        val >= 1000000 ? `R$ ${(val / 1000000).toFixed(2)}M` : `R$ ${(val / 1000).toFixed(0)} mil`;
      return `${formattedVal} (${pct}%)`;
    },
  };

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
      f.includes('PONTTO')
    )
      return 'Tecnologia & Equipamentos';
    return 'Outros Serviços & Materiais';
  }

  fornecedorControl = new FormControl<string | TopFornecedorItem>('');
  fornecedorBuscaTexto = signal<string>('');
  fornecedorSelecionado = signal<TopFornecedorItem | null>(null);

  fornecedoresListaCompleta = computed<TopFornecedorItem[]>(() => {
    const r = this.resumo();
    if (!r) return [];
    return r.todosFornecedores && r.todosFornecedores.length > 0
      ? r.todosFornecedores
      : r.topFornecedores || [];
  });

  fornecedoresFiltrados = computed<TopFornecedorItem[]>(() => {
    const lista = this.fornecedoresListaCompleta();
    const termo = this.fornecedorBuscaTexto().trim().toLowerCase();
    if (!termo) {
      return lista.slice(0, 40);
    }
    return lista.filter((f) => f.favorecido.toLowerCase().includes(termo)).slice(0, 40);
  });

  displayFornecedorFn = (fornecedor: TopFornecedorItem | string): string => {
    if (!fornecedor) return '';
    if (typeof fornecedor === 'string') return fornecedor;
    return fornecedor.favorecido;
  };

  selecionarFornecedor(fornecedor: TopFornecedorItem): void {
    this.fornecedorSelecionado.set(fornecedor);
    this.fornecedorControl.setValue(fornecedor.favorecido, { emitEvent: false });
  }

  limparBusca(): void {
    this.fornecedorControl.setValue('');
    this.fornecedorBuscaTexto.set('');
    this.fornecedorSelecionado.set(null);
  }

  fornecedorEvolucaoData = computed(() => {
    const f = this.fornecedorSelecionado();
    if (!f || !f.evolucaoMensal || f.evolucaoMensal.length === 0) {
      return {
        categories: ['Geral'],
        values: [f ? f.totalPago : 0],
      };
    }

    return {
      categories: f.evolucaoMensal.map((m) => m.mesAno),
      values: f.evolucaoMensal.map((m) => m.valorPago),
    };
  });

  evolucaoSeries = computed<ApexAxisChartSeries>(() => {
    const data = this.fornecedorEvolucaoData();
    return [
      {
        name: 'Valor Recebido',
        data: data.values,
      },
    ];
  });

  evolucaoCategories = computed<string[]>(() => this.fornecedorEvolucaoData().categories);

  maiorMesPagamento = computed(() => {
    const f = this.fornecedorSelecionado();
    if (!f || !f.evolucaoMensal || f.evolucaoMensal.length === 0) return null;
    let max = f.evolucaoMensal[0];
    for (const m of f.evolucaoMensal) {
      if (m.valorPago > max.valorPago) {
        max = m;
      }
    }
    return max;
  });

  evolucaoChart: ApexChart = {
    type: 'area',
    width: '100%',
    height: 320,
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
    fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 },
  };

  evolucaoStroke: ApexStroke = {
    curve: 'smooth',
    width: 3,
  };

  evolucaoColors = ['#006633'];

  evolucaoFill: ApexFill = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  };

  evolucaoMarkers: ApexMarkers = {
    size: 5,
    colors: ['#006633'],
    strokeColors: '#ffffff',
    strokeWidth: 2,
    hover: { size: 7 },
  };

  evolucaoGrid: ApexGrid = {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  };

  evolucaoDataLabels: ApexDataLabels = {
    enabled: false,
  };

  evolucaoYaxis: ApexYAxis = {
    labels: {
      formatter: (v: number) => {
        if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
        if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
        return `R$ ${v.toFixed(0)}`;
      },
      style: { fontSize: '11px', colors: '#64748b' },
    },
  };

  evolucaoResponsive = [
    {
      breakpoint: 640,
      options: {
        chart: {
          height: 280,
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '10px',
            },
          },
        },
        xaxis: {
          labels: {
            rotate: -45,
            style: {
              fontSize: '10px',
            },
          },
        },
      },
    },
  ];

  evolucaoTooltip: ApexTooltip = {
    theme: 'light',
    y: {
      formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
  };

  tabelaFiltro = signal<string>('');
  tabelaColunaOrdenacao = signal<
    'posicao' | 'favorecido' | 'segmento' | 'totalPago' | 'porcentagemDoTotal'
  >('totalPago');
  tabelaDirecaoOrdenacao = signal<'asc' | 'desc'>('desc');
  tabelaPaginaAtual = signal<number>(0);
  tabelaItensPorPagina = signal<number>(10);
  displayedColumns: string[] = [
    'posicao',
    'favorecido',
    'segmento',
    'totalPago',
    'porcentagemDoTotal',
    'acoes',
  ];

  fornecedoresTabelaEnriquecidos = computed(() => {
    const lista = this.fornecedoresListaCompleta();
    return lista.map((f, index) => ({
      ...f,
      posicaoOriginal: index + 1,
      segmento: this.categorizarSegmento(f.favorecido),
    }));
  });

  fornecedoresTabelaFiltrados = computed(() => {
    const lista = this.fornecedoresTabelaEnriquecidos();
    const termo = this.tabelaFiltro().trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter(
      (f) => f.favorecido.toLowerCase().includes(termo) || f.segmento.toLowerCase().includes(termo),
    );
  });

  fornecedoresTabelaOrdenados = computed(() => {
    const lista = [...this.fornecedoresTabelaFiltrados()];
    const col = this.tabelaColunaOrdenacao();
    const dir = this.tabelaDirecaoOrdenacao();
    const mult = dir === 'asc' ? 1 : -1;

    return lista.sort((a, b) => {
      if (col === 'posicao') {
        return (a.posicaoOriginal - b.posicaoOriginal) * mult;
      }
      if (col === 'favorecido') {
        return a.favorecido.localeCompare(b.favorecido, 'pt-BR') * mult;
      }
      if (col === 'segmento') {
        return a.segmento.localeCompare(b.segmento, 'pt-BR') * mult;
      }
      if (col === 'totalPago') {
        return (a.totalPago - b.totalPago) * mult;
      }
      if (col === 'porcentagemDoTotal') {
        return (a.porcentagemDoTotal - b.porcentagemDoTotal) * mult;
      }
      return 0;
    });
  });

  fornecedoresTabelaPaginados = computed(() => {
    const ordenados = this.fornecedoresTabelaOrdenados();
    const inicio = this.tabelaPaginaAtual() * this.tabelaItensPorPagina();
    return ordenados.slice(inicio, inicio + this.tabelaItensPorPagina());
  });

  totalFiltradoTabela = computed(() => {
    return this.fornecedoresTabelaFiltrados().reduce((acc, curr) => acc + curr.totalPago, 0);
  });

  alternarOrdenacao(
    coluna: 'posicao' | 'favorecido' | 'segmento' | 'totalPago' | 'porcentagemDoTotal',
  ): void {
    if (this.tabelaColunaOrdenacao() === coluna) {
      this.tabelaDirecaoOrdenacao.set(this.tabelaDirecaoOrdenacao() === 'asc' ? 'desc' : 'asc');
    } else {
      this.tabelaColunaOrdenacao.set(coluna);
      this.tabelaDirecaoOrdenacao.set(
        coluna === 'favorecido' || coluna === 'segmento' || coluna === 'posicao' ? 'asc' : 'desc',
      );
    }
  }

  aoMudarPagina(event: PageEvent): void {
    this.tabelaPaginaAtual.set(event.pageIndex);
    this.tabelaItensPorPagina.set(event.pageSize);
  }

  atualizarFiltroTabela(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.tabelaFiltro.set(input.value || '');
    this.tabelaPaginaAtual.set(0);
  }

  limparFiltroTabela(): void {
    this.tabelaFiltro.set('');
    this.tabelaPaginaAtual.set(0);
  }

  carregarNoGrafico(fornecedor: TopFornecedorItem): void {
    this.selecionarFornecedor(fornecedor);
    const element = document.getElementById('secao-grafico-fornecedor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnInit(): void {
    this.fornecedorControl.valueChanges.subscribe((val) => {
      if (typeof val === 'string') {
        this.fornecedorBuscaTexto.set(val);
        if (!val.trim()) {
          this.fornecedorSelecionado.set(null);
        }
      } else if (val && typeof val === 'object') {
        const item = val as TopFornecedorItem;
        this.fornecedorBuscaTexto.set(item.favorecido);
        this.fornecedorSelecionado.set(item);
      }
    });

    this.despesasService.ano$.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.loading.set(true);
    this.despesasService.getResumoFornecedores().subscribe({
      next: (data) => {
        this.resumo.set(data);
        this.fornecedorControl.setValue('', { emitEvent: false });
        this.fornecedorBuscaTexto.set('');
        this.fornecedorSelecionado.set(null);
        this.tabelaPaginaAtual.set(0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados de fornecedores:', err);
        this.error.set('Não foi possível carregar os dados de fornecedores e contratos.');
        this.loading.set(false);
      },
    });
  }
}
