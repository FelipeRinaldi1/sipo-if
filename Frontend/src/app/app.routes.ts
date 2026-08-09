import { Routes } from '@angular/router';
import { DashboardPublicoComponent } from './features/dashboard-publico/dashboard-publico';

export const routes: Routes = [
  { path: '', component: DashboardPublicoComponent },
  { path: 'dashboard', component: DashboardPublicoComponent }
];
