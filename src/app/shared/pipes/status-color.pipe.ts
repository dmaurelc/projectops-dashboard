import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus, TaskStatus } from '@core/models/status.model';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  private readonly statusColorMap: Record<string, BadgeVariant> = {
    // Project statuses
    'planning': 'info',
    'in_progress': 'primary',
    'on_hold': 'warning',
    'completed': 'success',
    'cancelled': 'danger',
    // Task statuses
    'todo': 'secondary',
    'in_review': 'info',
    'done': 'success',
    'blocked': 'danger'
  };

  transform(status: ProjectStatus | TaskStatus | string): BadgeVariant {
    return this.statusColorMap[status] || 'secondary';
  }
}
