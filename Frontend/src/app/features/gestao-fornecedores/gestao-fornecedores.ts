import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatProgressSpinnerModule
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
