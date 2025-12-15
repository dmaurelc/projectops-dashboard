import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { ProjectFormComponent } from '../../components/project-form/project-form.component';

@Component({
  selector: 'app-project-detail',
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
    ProjectFormComponent,
  ],
  template: `
    <div class="project-detail">
      <app-loader
        *ngIf="projectService.loading()"
        message="Loading project..."
      />

      <div
        *ngIf="!projectService.loading() && projectService.error()"
        class="error-message"
      >
        {{ projectService.error() }}
      </div>

      <div
        *ngIf="
          !projectService.loading() &&
          projectService.selectedProject() as project
        "
      >
        <div class="detail-header">
          <div class="header-left">
            <a routerLink="/projects" class="back-link">← Back to Projects</a>
            <h1>{{ project.name }}</h1>
            <app-status-badge
              [label]="project.status | statusLabel"
              [variant]="project.status | statusColor"
            />
          </div>
          <div class="header-actions">
            <app-button variant="outline" (clicked)="editProject()"
              >Edit</app-button
            >
            <app-button variant="danger" (clicked)="deleteProject()"
              >Delete</app-button
            >
          </div>
        </div>

        <div class="detail-content">
          <app-card title="Project Information">
            <div class="info-grid">
              <div class="info-item">
                <label>Description</label>
                <p>{{ project.description }}</p>
              </div>
              <div class="info-item">
                <label>Start Date</label>
                <p>{{ project.startDate | dateFormat : 'medium' }}</p>
              </div>
              <div class="info-item" *ngIf="project.endDate">
                <label>End Date</label>
                <p>{{ project.endDate | dateFormat : 'medium' }}</p>
              </div>
              <div class="info-item" *ngIf="project.budget">
                <label>Budget</label>
                <p>\${{ project.budget | number }}</p>
              </div>
              <div class="info-item">
                <label>Progress</label>
                <div class="progress-container">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      [style.width.%]="project.progress"
                    ></div>
                  </div>
                  <span class="progress-text">{{ project.progress }}%</span>
                </div>
              </div>
            </div>
          </app-card>

          <app-card title="Team Members">
            <div class="team-members">
              <p *ngIf="project.teamMemberIds.length === 0" class="empty">
                No team members assigned
              </p>
              <div
                *ngFor="let memberId of project.teamMemberIds"
                class="member-chip"
              >
                {{ getMemberName(memberId) }}
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <app-offcanvas
        *ngIf="showEditOffcanvas()"
        title="Edit Project"
        position="right"
        (close)="closeEditOffcanvas()"
      >
        <app-project-form
          [project]="projectService.selectedProject() || undefined"
          (save)="onUpdateProject($event)"
          (cancel)="closeEditOffcanvas()"
        />
      </app-offcanvas>
    </div>
  `,
  styles: [
    `
      .project-detail {
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
        gap: 0.5rem;
      }

      .back-link {
        color: #007bff;
        text-decoration: none;
        font-size: 0.9rem;
      }

      .back-link:hover {
        text-decoration: underline;
      }

      .detail-header h1 {
        margin: 0;
        font-size: 2rem;
        color: #333;
      }

      .header-actions {
        display: flex;
        gap: 0.5rem;
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
        color: #666;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-item p {
        margin: 0;
        color: #333;
        font-size: 1rem;
      }

      .progress-container {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .progress-bar {
        flex: 1;
        height: 8px;
        background-color: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background-color: #007bff;
        transition: width 0.3s;
      }

      .progress-text {
        font-weight: 600;
        color: #333;
      }

      .team-members {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .member-chip {
        padding: 0.5rem 1rem;
        background-color: #e9ecef;
        border-radius: 16px;
        font-size: 0.875rem;
        color: #333;
      }

      .empty {
        color: #999;
        font-style: italic;
      }

      .error-message {
        padding: 1rem;
        background-color: #f8d7da;
        color: #721c24;
        border-radius: 4px;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  projectService = inject(ProjectService);
  private teamService = inject(TeamService);

  showEditOffcanvas = signal(false);

  ngOnInit(): void {
    this.teamService.loadMembers();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.projectService.loadProjectById(id);
      }
    });
  }

  getMemberName(memberId: string): string {
    const member = this.teamService.getMemberById(memberId);
    return member ? member.name : `Member #${memberId}`;
  }

  editProject(): void {
    this.showEditOffcanvas.set(true);
  }

  closeEditOffcanvas(): void {
    this.showEditOffcanvas.set(false);
  }

  async onUpdateProject(projectData: any): Promise<void> {
    await this.projectService.updateProject(projectData);
    this.closeEditOffcanvas();
  }

  async deleteProject(): Promise<void> {
    const project = this.projectService.selectedProject();
    if (!project) return;

    if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      const success = await this.projectService.deleteProject(project.id);
      if (success) {
        this.router.navigate(['/projects']);
      }
    }
  }
}
