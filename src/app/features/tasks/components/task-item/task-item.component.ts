import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@core/models/task.model';
import { StatusBadgeComponent } from '@shared/components/ui/status-badge/status-badge.component';
import { StatusColorPipe } from '@shared/pipes/status-color.pipe';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, StatusColorPipe, StatusLabelPipe, DateFormatPipe],
  template: `
    <div
      (click)="taskClick.emit(task)"
      class="group rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 cursor-pointer"
    >
      <div class="flex items-start justify-between gap-4">
        <!-- Task Info -->
        <div class="flex-1 space-y-1">
          <!-- Title -->
          <h4 class="text-sm font-medium leading-none">
            {{ task.title }}
          </h4>

          <!-- Description -->
          <p class="text-sm text-muted-foreground line-clamp-2">
            {{ task.description }}
          </p>

          <!-- Meta Information -->
          <div class="flex items-center gap-3 pt-2">
            <!-- Status Badge -->
            <app-status-badge
              [label]="task.status | statusLabel"
              [variant]="task.status | statusColor"
              size="sm"
            />

            <!-- Priority -->
            <span class="text-xs text-muted-foreground">
              {{ getPriorityLabel(task.priority) }}
            </span>

            <!-- Due Date -->
            <span *ngIf="task.dueDate" class="flex items-center gap-1 text-xs text-muted-foreground">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ task.dueDate | dateFormat:'short' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() taskClick = new EventEmitter<Task>();

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
