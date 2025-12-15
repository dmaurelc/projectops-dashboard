import { Component, Input, computed } from '@angular/core';
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
    <div
      [routerLink]="['/tasks', task.id]"
      class="group relative bg-white rounded-xl border border-gray-200 p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <!-- Priority Indicator Strip -->
      <div [class]="priorityStripClasses()" class="absolute top-0 left-0 w-1 h-full rounded-l-xl transition-all duration-300"></div>

      <div class="flex flex-col gap-3 pl-3">
        <!-- Title -->
        <h4 class="text-base font-semibold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors">
          {{ task.title }}
        </h4>

        <!-- Description -->
        <p class="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {{ task.description }}
        </p>

        <!-- Meta Information -->
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Status Badge -->
          <app-status-badge
            [label]="task.status | statusLabel"
            [variant]="task.status | statusColor"
            size="sm"
          />

          <!-- Priority Badge -->
          <span [class]="priorityBadgeClasses()" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
            </svg>
            {{ getPriorityLabel(task.priority) }}
          </span>

          <!-- Due Date -->
          <span *ngIf="task.dueDate" class="ml-auto flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ task.dueDate | dateFormat:'short' }}
          </span>
        </div>
      </div>

      <!-- Hover Arrow -->
      <div class="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
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

  protected priorityStripClasses = computed(() => {
    const classes: Record<string, string> = {
      'critical': 'bg-red-600 group-hover:w-2',
      'high': 'bg-orange-500 group-hover:w-2',
      'medium': 'bg-yellow-500 group-hover:w-2',
      'low': 'bg-gray-400 group-hover:w-2'
    };
    return classes[this.task.priority] || 'bg-gray-400 group-hover:w-2';
  });

  protected priorityBadgeClasses = computed(() => {
    const classes: Record<string, string> = {
      'critical': 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20',
      'high': 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-600/20',
      'medium': 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
      'low': 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-600/20'
    };
    return classes[this.task.priority] || 'bg-gray-100 text-gray-600';
  });

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
