import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project, ProjectCreateDto } from '@core/models/project.model';
import { ProjectStatus } from '@core/models/status.model';
import { ProjectService } from '@core/services/project.service';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectFiltersComponent } from '../../components/project-filters/project-filters.component';
import { OffcanvasComponent } from '@shared/components/ui/offcanvas/offcanvas.component';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';

@Component({
  selector: 'app-projects-board',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    ProjectCardComponent,
    ProjectFiltersComponent,
    OffcanvasComponent,
    ProjectFormComponent,
  ],
  template: `
    <div class="projects-board">
      <div class="board-header">
        <div class="header-left">
          <h1>Projects</h1>
          <p class="subtitle">
            Manage and track all your projects in one place
          </p>
        </div>
        <app-button variant="primary" size="md" (clicked)="openCreateModal()">
          + New Project
        </app-button>
      </div>

      <app-project-filters (filterChange)="onFilterChange($event)" />

      <div class="kanban-board">
        <div *ngFor="let column of kanbanColumns()" class="kanban-column">
          <div class="column-header">
            <div class="column-title">
              <span class="title-text">{{ column.title }}</span>
              <span class="count">{{ column.projects.length }}</span>
            </div>
          </div>
          <div class="column-content">
            <a
              *ngFor="let project of column.projects"
              [routerLink]="['/projects', project.id]"
              class="project-link"
            >
              <app-project-card [project]="project" />
            </a>
            <div *ngIf="column.projects.length === 0" class="empty-state">
              <span>No projects</span>
            </div>
          </div>
        </div>
      </div>

      <app-offcanvas
        *ngIf="showCreateOffcanvas()"
        [title]="editingProject() ? 'Edit Project' : 'Create New Project'"
        position="right"
        (close)="closeOffcanvas()"
      >
        <app-project-form
          [project]="editingProject()"
          (save)="onSaveProject($event)"
          (cancel)="closeOffcanvas()"
        />
      </app-offcanvas>
    </div>
  `,
  styles: [
    `
      .projects-board {
        padding: 2rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #f9fafb;
      }

      .board-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .header-left h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.02em;
      }

      .subtitle {
        margin: 0.5rem 0 0 0;
        color: #6b7280;
        font-size: 0.9375rem;
      }

      .kanban-board {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 1.5rem;
        flex: 1;
        overflow-x: auto;
        padding-bottom: 1rem;
      }

      .kanban-column {
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        min-height: 500px;
        max-height: calc(100vh - 300px);
        overflow: hidden;
      }

      .column-header {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #f3f4f6;
        background: #fafbfc;
      }

      .column-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .title-text {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #e5e7eb;
        color: #4b5563;
        padding: 0.25rem 0.625rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        min-width: 1.5rem;
      }

      .column-content {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        overflow-y: auto;
        flex: 1;
      }

      .project-link {
        text-decoration: none;
        color: inherit;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .project-link:hover {
        transform: translateY(-2px);
      }

      .empty-state {
        text-align: center;
        padding: 2rem 1rem;
        color: #d1d5db;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }
    `,
  ],
})
export class ProjectsBoardComponent implements OnInit {
  private projectService = inject(ProjectService);
  showCreateOffcanvas = signal(false);
  editingProject = signal<Project | undefined>(undefined);

  kanbanColumns = computed(() => {
    const statuses = [
      { status: 'planning' as ProjectStatus, title: 'Planning' },
      { status: 'in_progress' as ProjectStatus, title: 'In Progress' },
      { status: 'on_hold' as ProjectStatus, title: 'On Hold' },
      { status: 'completed' as ProjectStatus, title: 'Completed' },
    ];

    return statuses.map(({ status, title }) => ({
      status,
      title,
      projects: this.projectService
        .projects()
        .filter((p) => p.status === status),
    }));
  });

  ngOnInit(): void {
    this.projectService.loadProjects();
  }

  openCreateModal(): void {
    this.editingProject.set(undefined);
    this.showCreateOffcanvas.set(true);
  }

  closeOffcanvas(): void {
    this.showCreateOffcanvas.set(false);
    this.editingProject.set(undefined);
  }

  async onSaveProject(projectData: ProjectCreateDto | any): Promise<void> {
    if (this.editingProject()) {
      // Update existing project
      await this.projectService.updateProject(projectData);
    } else {
      // Create new project
      await this.projectService.createProject(projectData);
    }
    this.closeOffcanvas();
  }

  onFilterChange(event: any): void {
    console.log('Filter changed:', event);
  }
}
