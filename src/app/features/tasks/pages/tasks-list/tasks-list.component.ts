import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskCreateDto } from '@core/models/task.model';
import { TaskService } from '@core/services/task.service';
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
    ButtonComponent,
    TaskItemComponent,
    TaskFiltersComponent,
    OffcanvasComponent,
    TaskFormComponent,
  ],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8"
    >
      <div class="container-custom max-w-7xl mx-auto">
        <!-- Header -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div class="flex-1">
            <h1
              class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2"
            >
              Tasks
            </h1>
            <p
              class="text-gray-600 text-sm sm:text-base flex items-center gap-2"
            >
              <svg
                class="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Manage and track all your tasks efficiently
            </p>
          </div>
          <app-button
            variant="default"
            size="lg"
            (clicked)="openCreateOffcanvas()"
            class="self-start sm:self-auto"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Task</span>
          </app-button>
        </div>

        <!-- Filters -->
        <app-task-filters (filterChange)="onFilterChange($event)" />

        <!-- Stats Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div
            class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                >
                  Total Tasks
                </p>
                <p class="text-2xl font-bold text-gray-900 mt-1">
                  {{ taskService.tasks().length }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                >
                  In Progress
                </p>
                <p class="text-2xl font-bold text-blue-600 mt-1">
                  {{ inProgressCount() }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                >
                  Completed
                </p>
                <p class="text-2xl font-bold text-green-600 mt-1">
                  {{ completedCount() }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                >
                  High Priority
                </p>
                <p class="text-2xl font-bold text-orange-600 mt-1">
                  {{ highPriorityCount() }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tasks List -->
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white"
          >
            <h2 class="text-lg font-semibold text-gray-900">All Tasks</h2>
            <span
              class="inline-flex items-center justify-center min-w-[32px] h-7 px-3 bg-primary-100 text-primary-700 rounded-full text-sm font-bold"
            >
              {{ taskService.tasks().length }}
            </span>
          </div>

          <!-- Tasks Grid -->
          <div class="p-4">
            <div class="grid gap-2">
              <app-task-item
                *ngFor="let task of taskService.tasks(); trackBy: trackByTaskId"
                [task]="task"
                (taskClick)="openTaskDetail($event)"
              />

              <!-- Empty State -->
              <div
                *ngIf="taskService.tasks().length === 0"
                class="flex flex-col items-center justify-center py-16"
              >
                <div
                  class="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center"
                >
                  <svg
                    class="w-10 h-10 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  No tasks yet
                </h3>
                <p class="text-sm text-gray-500 mb-6 text-center max-w-md">
                  Get started by creating your first task. Track your work and
                  stay organized.
                </p>
                <app-button variant="default" (clicked)="openCreateOffcanvas()">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Create First Task</span>
                </app-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Offcanvas -->
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
  styles: [],
})
export class TasksListComponent implements OnInit {
  taskService = inject(TaskService);
  showOffcanvas = signal(false);
  editingTask = signal<Task | undefined>(undefined);

  inProgressCount = computed(
    () =>
      this.taskService.tasks().filter((t) => t.status === 'in_progress').length
  );

  completedCount = computed(
    () => this.taskService.tasks().filter((t) => t.status === 'done').length
  );

  highPriorityCount = computed(
    () =>
      this.taskService
        .tasks()
        .filter((t) => t.priority === 'high' || t.priority === 'critical')
        .length
  );

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  openCreateOffcanvas(): void {
    this.editingTask.set(undefined);
    this.showOffcanvas.set(true);
  }

  openTaskDetail(task: Task): void {
    this.editingTask.set(task);
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

  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }
}
