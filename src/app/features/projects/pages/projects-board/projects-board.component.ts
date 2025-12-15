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
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div class="container-custom">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div class="flex-1">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Projects
            </h1>
            <p class="text-gray-600 text-sm sm:text-base">
              Manage and track all your projects in one place
            </p>
          </div>
          <app-button variant="primary" size="lg" (clicked)="openCreateModal()" class="self-start sm:self-auto">
            <span class="text-lg mr-2">+</span>
            <span>New Project</span>
          </app-button>
        </div>

        <!-- Filters -->
        <div class="mb-6">
          <app-project-filters (filterChange)="onFilterChange($event)" />
        </div>

        <!-- Kanban Board -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div *ngFor="let column of kanbanColumns()" class="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] max-h-[calc(100vh-280px)]">
            <!-- Column Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {{ column.title }}
                </span>
                <span class="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                  {{ column.projects.length }}
                </span>
              </div>
            </div>

            <!-- Column Content -->
            <div class="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <a
                *ngFor="let project of column.projects"
                [routerLink]="['/projects', project.id]"
                class="block transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl"
              >
                <app-project-card [project]="project" />
              </a>

              <!-- Empty State -->
              <div *ngIf="column.projects.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="text-sm text-gray-500 font-medium">No projects yet</p>
                <p class="text-xs text-gray-400 mt-1">Projects will appear here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Offcanvas -->
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
    </div>
  `,
  styles: [],
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
