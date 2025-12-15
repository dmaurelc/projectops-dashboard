import { Injectable, signal, computed, inject } from '@angular/core';
import {
  Project,
  ProjectCreateDto,
  ProjectUpdateDto,
} from '../models/project.model';
import { JsonDatabaseService } from './json-database.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private db = inject(JsonDatabaseService);

  private projectsState = signal<Project[]>([]);
  private selectedProjectState = signal<Project | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  readonly projects = this.projectsState.asReadonly();
  readonly selectedProject = this.selectedProjectState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly activeProjects = computed(() =>
    this.projectsState().filter((p) => p.status === 'in_progress')
  );

  readonly completedProjects = computed(() =>
    this.projectsState().filter((p) => p.status === 'completed')
  );

  async loadProjects(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const projects = await this.db.getProjects();
      this.projectsState.set(projects);
    } catch (error) {
      this.errorState.set('Error loading projects');
      console.error('Error loading projects:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async loadProjectById(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const project = await this.db.getProjectById(id);
      if (project) {
        this.selectedProjectState.set(project);
      } else {
        this.errorState.set(`Project with ID "${id}" not found`);
      }
    } catch (error) {
      this.errorState.set('Error loading project');
      console.error('Error loading project:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async createProject(data: ProjectCreateDto): Promise<Project | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newProject: Project = {
        id: this.db.generateId('projects'),
        ...data,
        teamMemberIds: data.teamMemberIds || [],
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const created = await this.db.createProject(newProject);
      this.projectsState.update((projects) => [...projects, created]);
      return created;
    } catch (error) {
      this.errorState.set('Error creating project');
      console.error('Error creating project:', error);
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  async updateProject(data: ProjectUpdateDto): Promise<Project | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const updated = await this.db.updateProject(data.id, data);
      if (updated) {
        this.projectsState.update((projects) =>
          projects.map((p) => (p.id === data.id ? updated : p))
        );
        if (this.selectedProjectState()?.id === data.id) {
          this.selectedProjectState.set(updated);
        }
        return updated;
      }
      return null;
    } catch (error) {
      this.errorState.set('Error updating project');
      console.error('Error updating project:', error);
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const success = await this.db.deleteProject(id);
      if (success) {
        this.projectsState.update((projects) =>
          projects.filter((p) => p.id !== id)
        );
        if (this.selectedProjectState()?.id === id) {
          this.selectedProjectState.set(null);
        }
      }
      return success;
    } catch (error) {
      this.errorState.set('Error deleting project');
      console.error('Error deleting project:', error);
      return false;
    } finally {
      this.loadingState.set(false);
    }
  }

  clearSelectedProject(): void {
    this.selectedProjectState.set(null);
  }
}
