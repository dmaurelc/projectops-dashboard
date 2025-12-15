import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectStatus } from '@core/models/status.model';

@Component({
  selector: 'app-project-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters">
      <div class="filter-group">
        <label for="status">Status</label>
        <select id="status" name="status" (change)="onFilterChange()">
          <option value="">All Statuses</option>
          <option [value]="ProjectStatus.PLANNING">Planning</option>
          <option [value]="ProjectStatus.IN_PROGRESS">In Progress</option>
          <option [value]="ProjectStatus.ON_HOLD">On Hold</option>
          <option [value]="ProjectStatus.COMPLETED">Completed</option>
          <option [value]="ProjectStatus.CANCELLED">Cancelled</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="search">Search</label>
        <input type="text" id="search" placeholder="Search projects..." (input)="onFilterChange()" />
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
export class ProjectFiltersComponent {
  @Output() filterChange = new EventEmitter<any>();

  ProjectStatus = ProjectStatus;

  onFilterChange(): void {
    this.filterChange.emit();
  }
}
