import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task } from '@core/models/task.model';
import { StatusBadgeComponent } from '@shared/components/ui/status-badge/status-badge.component';
import { StatusColorPipe } from '@shared/pipes/status-color.pipe';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, StatusColorPipe, StatusLabelPipe, DateFormatPipe],
  template: `
    <div class="task-item" [routerLink]="['/tasks', task.id]">
      <div class="task-info">
        <h4>{{ task.title }}</h4>
        <p>{{ task.description }}</p>
        <div class="task-meta">
          <app-status-badge
            [label]="task.status | statusLabel"
            [variant]="task.status | statusColor"
          />
          <span class="priority" [class]="'priority-' + task.priority">
            {{ getPriorityLabel(task.priority) }}
          </span>
          <span class="due-date" *ngIf="task.dueDate">
            {{ task.dueDate | dateFormat:'short' }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-item {
      padding: 1.25rem;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .task-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }

    .task-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.4;
    }

    p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .priority {
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .priority-critical {
      color: #dc2626;
    }

    .priority-high {
      color: #ea580c;
    }

    .priority-medium {
      color: #ca8a04;
    }

    .priority-low {
      color: #6b7280;
    }

    .due-date {
      font-size: 0.8125rem;
      color: #9ca3af;
      margin-left: auto;
    }
  `]
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;

  getPriorityLabel(priority: string): string {
    const map: Record<string, string> = {
      'critical': 'Critical',
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };
    return map[priority] || priority;
  }
}
