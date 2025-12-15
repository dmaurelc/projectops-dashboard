import { Routes } from '@angular/router';

export const AGENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/agents-dashboard/agents-dashboard.component').then(
        (m) => m.AgentsDashboardComponent
      )
  }
];
