import { Routes } from '@angular/router';
import { ProjectsBoardComponent } from './pages/projects-board/projects-board.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: ProjectsBoardComponent
  },
  {
    path: ':id',
    component: ProjectDetailComponent
  }
];
