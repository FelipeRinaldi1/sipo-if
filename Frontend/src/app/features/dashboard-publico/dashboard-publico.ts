import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DashboardService, DashboardPublicoData, StatusSincronizacaoData } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-publico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard-publico.html'
})
export class DashboardPublicoComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  loading = false;
  data?: DashboardPublicoData;
  statusSincronizacao?: StatusSincronizacaoData;

  anoSelecionado?: number = 2022;

  glossario = {
    empenhado: 'Valor reservado no orçamento do Campus Jacareí para a garantia de contratos e serviços.',
    liquidado: 'Valor relativo a bens e serviços atestados e recebidos pela administração do Campus Jacareí.',
    pago: 'Valor financeiro efetivamente transferido e pago aos fornecedores do campus.',
    taxaExecucao: 'Porcentagem do orçamento repassado e pago no exercício pelo Campus Jacareí.'
  };

  ngOnInit(): void {
    this.carregarDados();
    this.carregarStatusSincronizacao();
  }

  carregarDados(): void {
    this.loading = true;
    this.dashboardService.getDashboardData(this.anoSelecionado).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  carregarStatusSincronizacao(): void {
    this.dashboardService.getStatusSincronizacao().subscribe({
      next: (res) => {
        this.statusSincronizacao = res;
      }
    });
  }

  aoMudarFiltro(): void {
    this.carregarDados();
  }

  exportarCsv(): void {
    this.dashboardService.exportarCsv(this.anoSelecionado);
  }
}
