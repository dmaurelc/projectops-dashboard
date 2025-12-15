import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus, TaskStatus } from '@core/models/status.model';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusLabelPipe implements PipeTransform {
  private readonly statusLabels: Record<string, string> = {
    // Project statuses
    'planning': 'Planning',
    'in_progress': 'In Progress',
    'on_hold': 'On Hold',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    // Task statuses
    'todo': 'To Do',
    'in_review': 'In Review',
    'done': 'Done',
    'blocked': 'Blocked',
    // Priorities
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'critical': 'Critical',
    // Roles
    'admin': 'Admin',
    'project_manager': 'Project Manager',
    'developer': 'Developer',
    'designer': 'Designer',
    'qa': 'QA',
    'stakeholder': 'Stakeholder'
  };

  transform(status: ProjectStatus | TaskStatus | string): string {
    return this.statusLabels[status] || status;
  }
}
