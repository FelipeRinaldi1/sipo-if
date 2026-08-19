import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

import { DespesasService } from './core/despesas.service';
import { PainelExecucaoComponent } from './features/painel-execucao/painel-execucao';
import { DestinacaoEstudantilComponent } from './features/destinacao-estudantil/destinacao-estudantil';
import { GestaoFornecedoresComponent } from './features/gestao-fornecedores/gestao-fornecedores';
import { CategoriasComponent } from './features/categorias/categorias';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    PainelExecucaoComponent,
    DestinacaoEstudantilComponent,
    GestaoFornecedoresComponent,
    CategoriasComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private despesasService = inject(DespesasService);

  anosDisponiveis: string[] = ['todos', '2025'];
  anoSelecionado: string = '2025';
  activeTabIndex = signal<number>(0);
  readonly totalTabs = 4;

  ngOnInit(): void {
    this.despesasService.getAnosDisponiveis().subscribe({
      next: (anos) => {
        if (anos && anos.length > 0) {
          this.anosDisponiveis = anos;
          if (!this.anosDisponiveis.includes(this.anoSelecionado)) {
            this.anoSelecionado = this.anosDisponiveis.find((a) => a !== 'todos') || 'todos';
            this.despesasService.setAno(this.anoSelecionado);
          }
        }
      },
      error: () => {
        this.anosDisponiveis = ['todos', '2025'];
      },
    });
  }

  onAnoChange(novoAno: string): void {
    this.anoSelecionado = novoAno;
    this.despesasService.setAno(novoAno);
  }

  onTabChange(index?: number): void {
    if (typeof index === 'number') {
      this.activeTabIndex.set(index);
    }
    [50, 150, 300].forEach((delay) => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, delay);
    });
  }

  abaAnterior(): void {
    const atual = this.activeTabIndex();
    if (atual > 0) {
      this.activeTabIndex.set(atual - 1);
      this.onTabChange();
    }
  }

  proximaAba(): void {
    const atual = this.activeTabIndex();
    if (atual < this.totalTabs - 1) {
      this.activeTabIndex.set(atual + 1);
      this.onTabChange();
    }
  }

  formatarNomeAno(ano: string): string {
    return ano === 'todos' ? 'Todos os anos' : `Exercício ${ano}`;
  }
}
