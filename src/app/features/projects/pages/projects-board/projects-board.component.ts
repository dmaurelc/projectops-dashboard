import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectCreateDto } from '@core/models/project.model';
import { Task, TaskCreateDto } from '@core/models/task.model';
import { ProjectStatus } from '@core/models/status.model';
import { ProjectService } from '@core/services/project.service';
import { TaskService } from '@core/services/task.service';
import { TeamService } from '@core/services/team.service';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectFiltersComponent } from '../../components/project-filters/project-filters.component';
import { OffcanvasComponent } from '@shared/components/ui/offcanvas/offcanvas.component';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { TaskFormComponent } from '../../../tasks/components/task-form/task-form.component';
import { StatusBadgeComponent } from '@shared/components/ui/status-badge/status-badge.component';
import { StatusColorPipe } from '@shared/pipes/status-color.pipe';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';

@Component({
  selector: 'app-projects-board',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ProjectCardComponent,
    ProjectFiltersComponent,
    OffcanvasComponent,
    ProjectFormComponent,
    TaskFormComponent,
    StatusBadgeComponent,
    StatusColorPipe,
    StatusLabelPipe,
  ],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8"
    >
      <div class="container-custom">
        <!-- Header -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div class="flex-1">
            <h1
              class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2"
            >
              Projects
            </h1>
            <p class="text-gray-600 text-sm sm:text-base">
              Manage and track all your projects in one place
            </p>
          </div>
          <app-button
            variant="default"
            size="lg"
            (clicked)="openCreateModal()"
            class="self-start sm:self-auto"
          >
            <span class="text-lg mr-2">+</span>
            <span>New Project</span>
          </app-button>
        </div>

        <!-- Filters -->
        <div class="mb-6">
          <app-project-filters (filterChange)="onFilterChange($event)" />
        </div>

        <!-- Kanban Board -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          <div
            *ngFor="let column of kanbanColumns(); trackBy: trackByColumnStatus"
            class="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] max-h-[calc(100vh-280px)]"
          >
            <!-- Column Header -->
            <div
              class="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white"
            >
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-semibold text-gray-900 uppercase tracking-wide"
                >
                  {{ column.title }}
                </span>
                <span
                  class="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-primary-100 text-primary-700 rounded-full text-xs font-bold"
                >
                  {{ column.projects.length }}
                </span>
              </div>
            </div>

            <!-- Column Content -->
            <div
              class="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              <div
                *ngFor="
                  let project of column.projects;
                  trackBy: trackByProjectId
                "
                class="transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl"
              >
                <app-project-card
                  [project]="project"
                  (projectClick)="openProjectDetail($event)"
                />
              </div>

              <!-- Empty State -->
              <div
                *ngIf="column.projects.length === 0"
                class="flex flex-col items-center justify-center py-12 text-center"
              >
                <div
                  class="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p class="text-sm text-gray-500 font-medium">No projects yet</p>
                <p class="text-xs text-gray-400 mt-1">
                  Projects will appear here
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Create/Edit Offcanvas -->
        <app-offcanvas
          *ngIf="showCreateOffcanvas()"
          [title]="editingProject() ? 'Edit Project' : 'Create New Project'"
          position="right"
          (close)="closeCreateOffcanvas()"
        >
          <app-project-form
            [project]="editingProject()"
            (save)="onSaveProject($event)"
            (cancel)="closeCreateOffcanvas()"
          />
        </app-offcanvas>

        <!-- Detail Offcanvas -->
        <app-offcanvas
          *ngIf="showDetailOffcanvas() && selectedProject()"
          [title]="selectedProject()!.name"
          position="right"
          (close)="closeDetailOffcanvas()"
        >
          <div class="space-y-6">
            <!-- Project Info -->
            <div>
              <h3 class="text-sm font-medium text-muted-foreground mb-3">
                Project Information
              </h3>
              <div class="space-y-3">
                <div>
                  <label
                    class="text-xs text-muted-foreground uppercase tracking-wider"
                    >Description</label
                  >
                  <p class="text-sm mt-1">
                    {{ selectedProject()!.description }}
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      class="text-xs text-muted-foreground uppercase tracking-wider"
                      >Status</label
                    >
                    <p class="text-sm mt-1 capitalize">
                      {{ selectedProject()!.status }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="text-xs text-muted-foreground uppercase tracking-wider"
                      >Progress</label
                    >
                    <p class="text-sm mt-1">
                      {{ selectedProject()!.progress }}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t">
              <app-button
                variant="outline"
                size="sm"
                (clicked)="editProject(selectedProject()!)"
                class="flex-1"
              >
                Edit Project
              </app-button>
              <app-button
                variant="destructive"
                size="sm"
                (clicked)="deleteProject(selectedProject()!)"
              >
                Delete
              </app-button>
            </div>

            <!-- Tasks Section -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-muted-foreground">
                  Tasks ({{ projectTasks().length }})
                </h3>
                <app-button
                  variant="outline"
                  size="sm"
                  (clicked)="createTask()"
                >
                  Add Task
                </app-button>
              </div>

              <div
                *ngIf="projectTasks().length === 0"
                class="text-center py-8 text-sm text-muted-foreground"
              >
                No tasks yet. Create one to get started.
              </div>

              <div *ngIf="projectTasks().length > 0" class="space-y-2">
                <div
                  *ngFor="let task of projectTasks(); trackBy: trackByTaskId"
                  class="rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                  (click)="viewTask(task.id)"
                >
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h4 class="text-sm font-medium flex-1">{{ task.title }}</h4>
                    <app-status-badge
                      [label]="task.status | statusLabel"
                      [variant]="task.status | statusColor"
                      size="sm"
                    />
                  </div>
                  <p class="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {{ task.description }}
                  </p>
                  <div
                    class="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <span class="capitalize">{{ task.priority }}</span>
                    <span *ngIf="task.assignedToId"
                      >• {{ getTeamMemberName(task.assignedToId) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </app-offcanvas>

        <!-- Task Create/Edit Offcanvas -->
        <app-offcanvas
          *ngIf="showTaskOffcanvas()"
          [title]="editingTask() ? 'Edit Task' : 'Create New Task'"
          position="right"
          (close)="closeTaskOffcanvas()"
        >
          <app-task-form
            [task]="editingTask()"
            [projectId]="selectedProject()?.id"
            (save)="onSaveTask($event)"
            (cancel)="closeTaskOffcanvas()"
          />
        </app-offcanvas>
      </div>
    </div>
  `,
  styles: [],
})
export class ProjectsBoardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private teamService = inject(TeamService);
  showCreateOffcanvas = signal(false);
  showDetailOffcanvas = signal(false);
  showTaskOffcanvas = signal(false);
  editingProject = signal<Project | undefined>(undefined);
  selectedProject = signal<Project | undefined>(undefined);
  editingTask = signal<Task | undefined>(undefined);

  projectTasks = computed(() => {
    const project = this.selectedProject();
    if (!project) return [];
    return this.taskService
      .tasks()
      .filter((task) => task.projectId === project.id);
  });

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
    this.taskService.loadTasks();
    this.teamService.loadMembers();
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  trackByColumnStatus(index: number, column: any): string {
    return column.status;
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  openCreateModal(): void {
    this.editingProject.set(undefined);
    this.showCreateOffcanvas.set(true);
  }

  closeCreateOffcanvas(): void {
    this.showCreateOffcanvas.set(false);
    this.editingProject.set(undefined);
  }

  openProjectDetail(project: Project): void {
    this.selectedProject.set(project);
    this.showDetailOffcanvas.set(true);
  }

  closeDetailOffcanvas(): void {
    this.showDetailOffcanvas.set(false);
    this.selectedProject.set(undefined);
  }

  editProject(project: Project): void {
    this.closeDetailOffcanvas();
    this.editingProject.set(project);
    this.showCreateOffcanvas.set(true);
  }

  async deleteProject(project: Project): Promise<void> {
    if (
      confirm(
        `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
      )
    ) {
      await this.projectService.deleteProject(project.id);
      this.closeDetailOffcanvas();
    }
  }

  createTask(): void {
    this.editingTask.set(undefined);
    this.showTaskOffcanvas.set(true);
  }

  viewTask(taskId: string): void {
    const task = this.taskService.tasks().find((t) => t.id === taskId);
    if (task) {
      this.editingTask.set(task);
      this.showTaskOffcanvas.set(true);
    }
  }

  closeTaskOffcanvas(): void {
    this.showTaskOffcanvas.set(false);
    this.editingTask.set(undefined);
  }

  getTeamMemberName(memberId: string): string {
    const member = this.teamService.getMemberById(memberId);
    return member ? member.name : 'Unassigned';
  }

  async onSaveProject(projectData: ProjectCreateDto | any): Promise<void> {
    // Validar que tenemos datos válidos antes de procesar
    if (!projectData || !projectData.name || !projectData.description) {
      console.warn('Invalid project data, skipping save');
      this.closeCreateOffcanvas();
      return;
    }

    const isEditing = this.editingProject();

    if (isEditing) {
      // Update existing project - ensure id is present
      const updateData = {
        ...projectData,
        id: isEditing.id,
      };
      await this.projectService.updateProject(updateData);
    } else {
      // Create new project
      await this.projectService.createProject(projectData);
    }
    this.closeCreateOffcanvas();
  }

  onFilterChange(event: any): void {
    console.log('Filter changed:', event);
  }

  async onSaveTask(taskData: TaskCreateDto | Task): Promise<void> {
    if (this.editingTask()) {
      // Update existing task
      await this.taskService.updateTask(taskData as Task);
    } else {
      // Create new task
      await this.taskService.createTask(taskData as TaskCreateDto);
    }
    this.closeTaskOffcanvas();
  }
}
