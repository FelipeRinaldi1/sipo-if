import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

import { PainelExecucaoComponent } from './features/painel-execucao/painel-execucao';
import { DestinacaoEstudantilComponent } from './features/destinacao-estudantil/destinacao-estudantil';
import { GestaoFornecedoresComponent } from './features/gestao-fornecedores/gestao-fornecedores';
import { CategoriasComponent } from './features/categorias/categorias';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    PainelExecucaoComponent,
    DestinacaoEstudantilComponent,
    GestaoFornecedoresComponent,
    CategoriasComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('template-web');
}
