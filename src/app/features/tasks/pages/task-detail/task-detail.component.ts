import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '@core/services/task.service';
import { ProjectService } from '@core/services/project.service';
import { TeamService } from '@core/services/team.service';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { LoaderComponent } from '@shared/components/ui/loader/loader.component';
import { StatusBadgeComponent } from '@shared/components/ui/status-badge/status-badge.component';
import { StatusColorPipe } from '@shared/pipes/status-color.pipe';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { OffcanvasComponent } from '@shared/components/ui/offcanvas/offcanvas.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    LoaderComponent,
    StatusBadgeComponent,
    StatusColorPipe,
    StatusLabelPipe,
    DateFormatPipe,
    OffcanvasComponent,
    TaskFormComponent
  ],
  template: `
    <div class="task-detail">
      <app-loader *ngIf="loading()" message="Loading task..." />

      <div *ngIf="!loading() && error()" class="error-message">
        {{ error() }}
      </div>

      <div *ngIf="!loading() && !error() && task()" class="task-content">
        <div class="detail-header">
          <div class="header-left">
            <a routerLink="/tasks" class="back-link">← Back to Tasks</a>
            <h1>{{ task()!.title }}</h1>
            <div class="badges">
              <app-status-badge
                [label]="task()!.status | statusLabel"
                [variant]="task()!.status | statusColor"
              />
              <app-status-badge
                [label]="getPriorityLabel(task()!.priority)"
                [variant]="getPriorityVariant(task()!.priority)"
              />
            </div>
          </div>
          <div class="header-actions">
            <app-button variant="outline" (clicked)="editTask()">Edit</app-button>
            <app-button variant="danger" (clicked)="deleteTask()">Delete</app-button>
          </div>
        </div>

        <div class="detail-content">
          <app-card title="Task Information">
            <div class="info-grid">
              <div class="info-item">
                <label>Description</label>
                <p>{{ task()!.description }}</p>
              </div>
              <div class="info-item">
                <label>Project</label>
                <p>{{ getProjectName(task()!.projectId) }}</p>
              </div>
              <div class="info-item">
                <label>Assigned To</label>
                <p>{{ getMemberName(task()!.assignedToId) }}</p>
              </div>
              <div class="info-item" *ngIf="task()!.dueDate">
                <label>Due Date</label>
                <p>{{ task()!.dueDate | dateFormat:'long' }}</p>
              </div>
              <div class="info-item" *ngIf="task()!.estimatedHours">
                <label>Estimated Hours</label>
                <p>{{ task()!.estimatedHours }}h</p>
              </div>
              <div class="info-item" *ngIf="task()!.actualHours">
                <label>Actual Hours</label>
                <p>{{ task()!.actualHours }}h</p>
              </div>
            </div>
          </app-card>

          <app-card title="Tags" *ngIf="task()!.tags && task()!.tags.length > 0">
            <div class="tags">
              <span *ngFor="let tag of task()!.tags" class="tag">{{ tag }}</span>
            </div>
          </app-card>
        </div>
      </div>

      <app-offcanvas
        *ngIf="showEditOffcanvas()"
        title="Edit Task"
        position="right"
        (close)="closeEditOffcanvas()"
      >
        <app-task-form
          [task]="task() || undefined"
          (save)="onUpdateTask($event)"
          (cancel)="closeEditOffcanvas()"
        />
      </app-offcanvas>
    </div>
  `,
  styles: [`
    .task-detail {
      padding: 2rem;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .back-link {
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: #2563eb;
    }

    .detail-header h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .badges {
      display: flex;
      gap: 0.5rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-item label {
      display: block;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 0.5rem;
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item p {
      margin: 0;
      color: #1a1a1a;
      font-size: 0.9375rem;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.5rem 1rem;
      background-color: #f3f4f6;
      border-radius: 16px;
      font-size: 0.8125rem;
      color: #1a1a1a;
      font-weight: 500;
    }

    .error-message {
      padding: 1rem;
      background-color: #fef2f2;
      color: #991b1b;
      border-radius: 8px;
      margin-bottom: 1rem;
      border: 1px solid #fecaca;
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private teamService = inject(TeamService);

  loading = this.taskService.loading;
  error = this.taskService.error;
  task = this.taskService.selectedTask;
  showEditOffcanvas = signal(false);

  ngOnInit(): void {
    this.teamService.loadMembers();
    this.projectService.loadProjects();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.taskService.loadTaskById(id);
      }
    });
  }

  getPriorityVariant(priority: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' {
    const map: Record<string, 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'> = {
      'critical': 'danger',
      'high': 'warning',
      'medium': 'info',
      'low': 'secondary'
    };
    return map[priority] || 'secondary';
  }

  getPriorityLabel(priority: string): string {
    const map: Record<string, string> = {
      'critical': 'Critical',
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };
    return map[priority] || priority;
  }

  getProjectName(projectId: string): string {
    const project = this.projectService.projects().find(p => p.id === projectId);
    return project ? project.name : `Project #${projectId}`;
  }

  getMemberName(memberId: string | undefined): string {
    if (!memberId) return 'Unassigned';
    const member = this.teamService.getMemberById(memberId);
    return member ? member.name : `Member #${memberId}`;
  }

  editTask(): void {
    this.showEditOffcanvas.set(true);
  }

  closeEditOffcanvas(): void {
    this.showEditOffcanvas.set(false);
  }

  async onUpdateTask(taskData: any): Promise<void> {
    await this.taskService.updateTask(taskData);
    this.closeEditOffcanvas();
  }

  async deleteTask(): Promise<void> {
    const currentTask = this.task();
    if (!currentTask) return;

    if (confirm(`Are you sure you want to delete "${currentTask.title}"? This action cannot be undone.`)) {
      const success = await this.taskService.deleteTask(currentTask.id);
      if (success) {
        this.router.navigate(['/tasks']);
      }
    }
  }
}
