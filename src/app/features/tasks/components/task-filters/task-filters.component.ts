import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskStatus, TaskPriority } from '@core/models/task.model';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters">
      <div class="filter-group">
        <label for="status">Status</label>
        <select id="status" name="status" (change)="onFilterChange()">
          <option value="">All Statuses</option>
          <option [value]="TaskStatus.TODO">To Do</option>
          <option [value]="TaskStatus.IN_PROGRESS">In Progress</option>
          <option [value]="TaskStatus.IN_REVIEW">In Review</option>
          <option [value]="TaskStatus.DONE">Done</option>
          <option [value]="TaskStatus.BLOCKED">Blocked</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="priority">Priority</label>
        <select id="priority" name="priority" (change)="onFilterChange()">
          <option value="">All Priorities</option>
          <option [value]="TaskPriority.CRITICAL">Critical</option>
          <option [value]="TaskPriority.HIGH">High</option>
          <option [value]="TaskPriority.MEDIUM">Medium</option>
          <option [value]="TaskPriority.LOW">Low</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="search">Search</label>
        <input type="text" id="search" placeholder="Search tasks..." (input)="onFilterChange()" />
      </div>
    </div>
  `,
  styles: [`
    .filters {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    label {
      font-weight: 600;
      font-size: 0.875rem;
      color: #666;
    }

    select,
    input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    select:focus,
    input:focus {
      outline: none;
      border-color: #007bff;
    }
  `]
})
export class TaskFiltersComponent {
  @Output() filterChange = new EventEmitter<any>();

  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  onFilterChange(): void {
    this.filterChange.emit();
  }
}
