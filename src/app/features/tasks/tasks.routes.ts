import { Routes } from '@angular/router';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TasksListComponent
  },
  {
    path: ':id',
    component: TaskDetailComponent
  }
];
