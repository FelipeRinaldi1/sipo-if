import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DespesasService, ResultadoPaginadoDocumentos } from '../../core/services/despesas.service';

@Component({
  selector: 'app-extrato-documentos',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './extrato-documentos.html'
})
export class ExtratoDocumentosComponent implements OnInit {
  private despesasService = inject(DespesasService);

  resultado = signal<ResultadoPaginadoDocumentos | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  searchTerm = signal<string>('');
  pageIndex = signal<number>(0);
  pageSize = signal<number>(10);

  displayedColumns: string[] = ['data', 'documento', 'favorecido', 'fase', 'elementoDespesa', 'valor'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.despesasService.getDocumentosPaginado(this.searchTerm(), this.pageIndex() + 1, this.pageSize()).subscribe({
      next: (data) => {
        this.resultado.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar extrato de documentos:', err);
        this.error.set('Não foi possível carregar o extrato de documentos.');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.pageIndex.set(0);
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }
}
