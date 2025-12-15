import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.TASKS_ROUTES)
  },
  {
    path: 'team',
    canActivate: [authGuard],
    loadChildren: () => import('./features/team/team.routes').then(m => m.TEAM_ROUTES)
  },
  {
    path: 'metrics',
    canActivate: [authGuard],
    loadChildren: () => import('./features/metrics/metrics.routes').then(m => m.METRICS_ROUTES)
  },
  {
    path: 'agents',
    canActivate: [authGuard],
    loadChildren: () => import('./features/agents/agents.routes').then(m => m.AGENTS_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'projects'
  }
];
