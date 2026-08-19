import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexTooltip,
  ApexPlotOptions,
  ApexLegend,
  ApexGrid,
  ApexStroke,
} from 'ng-apexcharts';
import {
  DespesasService,
  ResumoProgramaAcao,
  ItemAcaoResumo,
  EvolucaoAssistenciaItem,
} from '../../core/services/despesas.service';

@Component({
  selector: 'app-destinacao-estudantil',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgApexchartsModule,
  ],
  templateUrl: './destinacao-estudantil.html',
})
export class DestinacaoEstudantilComponent implements OnInit {
  private despesasService = inject(DespesasService);

  resumo = signal<ResumoProgramaAcao | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  acaoSelecionada = signal<'2994' | '20RL'>('2994');

  acoesFiltradas = computed<ItemAcaoResumo[]>(() => {
    const r = this.resumo();
    if (!r) return [];
    return r.acoes.filter((a) => a.codigoAcao === '20RL' || a.codigoAcao === '2994');
  });

  evolucaoAssistenciaFiltrada = computed<EvolucaoAssistenciaItem[]>(() => {
    const lista = this.resumo()?.evolucaoAssistenciaMensal ?? [];
    const cod = this.acaoSelecionada();
    return lista.filter((m) => m.codigoAcao === cod);
  });

  compChartSeries = computed<ApexAxisChartSeries>(() => {
    const acoes = this.acoesFiltradas();
    return [
      { name: 'Empenhado', data: acoes.map((a) => +(a.totalEmpenhado / 1000).toFixed(2)) },
      { name: 'Pago', data: acoes.map((a) => +(a.totalPago / 1000).toFixed(2)) },
    ];
  });

  compChartCategories = computed<string[]>(() => {
    const acoes = this.acoesFiltradas();
    return acoes.map((a) => {
      const nome = a.nomeAcao.split(' - ')[0] ?? a.nomeAcao;
      return nome.length > 30 ? nome.substring(0, 30) + '…' : nome;
    });
  });

  compChart: ApexChart = {
    type: 'bar',
    width: '100%',
    height: 280,
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 },
  };
  compDataLabels: ApexDataLabels = { enabled: false };
  compColors = ['#006633', '#cc0000'];
  compGrid: ApexGrid = { borderColor: '#f1f5f9', strokeDashArray: 4 };
  compTooltip: ApexTooltip = {
    y: {
      formatter: (v: number) =>
        `R$ ${(v * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
    },
  };
  compLegend: ApexLegend = { position: 'top', horizontalAlign: 'right' };
  compPlotOptions: ApexPlotOptions = {
    bar: { horizontal: false, columnWidth: '50%', borderRadius: 4 },
  };

  evolucaoMensalSeries = computed<ApexAxisChartSeries>(() => {
    const lista = this.evolucaoAssistenciaFiltrada();
    const cod = this.acaoSelecionada();
    return [
      { name: `Empenhado (${cod})`, data: lista.map((m) => +(m.valorEmpenhado / 1000).toFixed(2)) },
      { name: `Pago (${cod})`, data: lista.map((m) => +(m.valorPago / 1000).toFixed(2)) },
    ];
  });

  evolucaoMensalCategories = computed<string[]>(() => {
    return this.evolucaoAssistenciaFiltrada().map((m) => m.mesAno);
  });

  evolucaoMensalChart: ApexChart = {
    type: 'line',
    width: '100%',
    height: 280,
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 },
  };
  evolucaoMensalStroke: ApexStroke = { curve: 'smooth', width: 3 };
  evolucaoMensalColors = ['#006633', '#cc0000'];

  acumuladoSeries = computed<ApexAxisChartSeries>(() => {
    const lista = this.evolucaoAssistenciaFiltrada();
    const cod = this.acaoSelecionada();
    let accEmp = 0;
    let accPago = 0;

    const dataEmp: number[] = [];
    const dataPago: number[] = [];

    for (const m of lista) {
      accEmp += m.valorEmpenhado;
      accPago += m.valorPago;
      dataEmp.push(+(accEmp / 1000).toFixed(2));
      dataPago.push(+(accPago / 1000).toFixed(2));
    }

    return [
      { name: `Empenhado Acumulado (${cod})`, data: dataEmp },
      { name: `Pago Acumulado (${cod})`, data: dataPago },
    ];
  });

  acumuladoChart: ApexChart = {
    type: 'line',
    width: '100%',
    height: 280,
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: { enabled: true, speed: 600 },
  };
  acumuladoStroke: ApexStroke = { curve: 'smooth', width: 3 };

  selecionarAcao(codigo: '2994' | '20RL'): void {
    this.acaoSelecionada.set(codigo);
  }

  ngOnInit(): void {
    this.despesasService.ano$.subscribe(() => {
      this.loadData();
    });
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
      },
    });
  }

  getAssistenciaTotal(): number {
    const r = this.resumo();
    if (!r) return 0;
    const item = r.acoes.find((a) => a.codigoAcao === '2994');
    return item ? item.totalPago : 0;
  }

  getFuncionamentoTotal(): number {
    const r = this.resumo();
    if (!r) return 0;
    const item = r.acoes.find((a) => a.codigoAcao === '20RL');
    return item ? item.totalPago : 0;
  }

  getAssistenciaPorcentagem(): number {
    const total = this.resumo()?.totalGeralPago || 0;
    if (total === 0) return 0;
    return Math.round((this.getAssistenciaTotal() / total) * 100);
  }
}
