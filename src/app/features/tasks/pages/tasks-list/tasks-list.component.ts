import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task, TaskCreateDto } from '@core/models/task.model';
import { TaskService } from '@core/services/task.service';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { TaskFiltersComponent } from '../../components/task-filters/task-filters.component';
import { OffcanvasComponent } from '@shared/components/ui/offcanvas/offcanvas.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    TaskItemComponent,
    TaskFiltersComponent,
    OffcanvasComponent,
    TaskFormComponent,
  ],
  template: `
    <div class="tasks-list">
      <div class="list-header">
        <h1>Tasks</h1>
        <app-button variant="primary" (clicked)="openCreateOffcanvas()">
          + New Task
        </app-button>
      </div>

      <app-task-filters (filterChange)="onFilterChange($event)" />

      <div class="tasks-container">
        <app-card title="All Tasks">
          <div class="tasks-grid">
            <app-task-item
              *ngFor="let task of taskService.tasks()"
              [task]="task"
            />
            <p *ngIf="taskService.tasks().length === 0" class="empty-message">
              No tasks found. Create your first task!
            </p>
          </div>
        </app-card>
      </div>

      <app-offcanvas
        *ngIf="showOffcanvas()"
        [title]="editingTask() ? 'Edit Task' : 'Create New Task'"
        position="right"
        (close)="closeOffcanvas()"
      >
        <app-task-form
          [task]="editingTask()"
          (save)="onSaveTask($event)"
          (cancel)="closeOffcanvas()"
        />
      </app-offcanvas>
    </div>
  `,
  styles: [`
    .tasks-list {
      padding: 2rem;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .list-header h1 {
      margin: 0;
      font-size: 2rem;
      color: #111827;
      font-weight: 700;
    }

    .tasks-container {
      max-width: 1200px;
    }

    .tasks-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .empty-message {
      text-align: center;
      color: #9ca3af;
      padding: 3rem 1rem;
      font-size: 0.9375rem;
    }
  `]
})
export class TasksListComponent implements OnInit {
  taskService = inject(TaskService);
  showOffcanvas = signal(false);
  editingTask = signal<Task | undefined>(undefined);

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  openCreateOffcanvas(): void {
    this.editingTask.set(undefined);
    this.showOffcanvas.set(true);
  }

  closeOffcanvas(): void {
    this.showOffcanvas.set(false);
    this.editingTask.set(undefined);
  }

  async onSaveTask(taskData: TaskCreateDto | any): Promise<void> {
    if (this.editingTask()) {
      await this.taskService.updateTask(taskData);
    } else {
      await this.taskService.createTask(taskData);
    }
    this.closeOffcanvas();
  }

  onFilterChange(event: any): void {
    console.log('Filter changed:', event);
  }
}
