import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskStatus, TaskPriority } from '@core/models/task.model';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Status Filter -->
        <div class="flex flex-col gap-2">
          <label for="status" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Status
          </label>
          <select
            id="status"
            name="status"
            (change)="onFilterChange()"
            class="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors hover:bg-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option [value]="TaskStatus.TODO">To Do</option>
            <option [value]="TaskStatus.IN_PROGRESS">In Progress</option>
            <option [value]="TaskStatus.IN_REVIEW">In Review</option>
            <option [value]="TaskStatus.DONE">Done</option>
            <option [value]="TaskStatus.BLOCKED">Blocked</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="flex flex-col gap-2">
          <label for="priority" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            (change)="onFilterChange()"
            class="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors hover:bg-white cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option [value]="TaskPriority.CRITICAL">Critical</option>
            <option [value]="TaskPriority.HIGH">High</option>
            <option [value]="TaskPriority.MEDIUM">Medium</option>
            <option [value]="TaskPriority.LOW">Low</option>
          </select>
        </div>

        <!-- Search Filter -->
        <div class="flex flex-col gap-2">
          <label for="search" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </label>
          <div class="relative">
            <input
              type="text"
              id="search"
              placeholder="Search tasks..."
              (input)="onFilterChange()"
              class="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors hover:bg-white"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TaskFiltersComponent {
  @Output() filterChange = new EventEmitter<any>();

  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  onFilterChange(): void {
    this.filterChange.emit();
  }
}
