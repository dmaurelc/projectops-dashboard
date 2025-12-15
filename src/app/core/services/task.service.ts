import { Injectable, signal, computed, inject } from '@angular/core';
import { Task, TaskCreateDto, TaskUpdateDto } from '../models/task.model';
import { JsonDatabaseService } from './json-database.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private db = inject(JsonDatabaseService);

  private tasksState = signal<Task[]>([]);
  private selectedTaskState = signal<Task | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  readonly tasks = this.tasksState.asReadonly();
  readonly selectedTask = this.selectedTaskState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly tasksByProject = computed(() => {
    const map = new Map<string, Task[]>();
    this.tasksState().forEach(task => {
      const tasks = map.get(task.projectId) || [];
      tasks.push(task);
      map.set(task.projectId, tasks);
    });
    return map;
  });

  readonly tasksByStatus = computed(() => {
    const map = new Map<string, Task[]>();
    this.tasksState().forEach(task => {
      const tasks = map.get(task.status) || [];
      tasks.push(task);
      map.set(task.status, tasks);
    });
    return map;
  });

  readonly overdueTasks = computed(() => {
    const now = new Date();
    return this.tasksState().filter(task =>
      task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
    );
  });

  async loadTasks(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const tasks = await this.db.getTasks();
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set('Error loading tasks');
      console.error('Error loading tasks:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async loadTaskById(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const task = await this.db.getTaskById(id);
      this.selectedTaskState.set(task);
    } catch (error) {
      this.errorState.set('Error loading task');
      console.error('Error loading task:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async loadTasksByProject(projectId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const tasks = await this.db.getTasksByProject(projectId);
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set('Error loading tasks');
      console.error('Error loading tasks:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async createTask(data: TaskCreateDto): Promise<Task | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newTask: Task = {
        id: this.db.generateId('tasks'),
        ...data,
        tags: data.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const task = await this.db.createTask(newTask);
      this.tasksState.update(tasks => [...tasks, task]);
      return task;
    } catch (error) {
      this.errorState.set('Error creating task');
      console.error('Error creating task:', error);
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  async updateTask(data: TaskUpdateDto): Promise<Task | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const task = await this.db.updateTask(data.id, data);
      if (task) {
        this.tasksState.update(tasks =>
          tasks.map(t => t.id === task.id ? task : t)
        );
        if (this.selectedTaskState()?.id === task.id) {
          this.selectedTaskState.set(task);
        }
        return task;
      }
      return null;
    } catch (error) {
      this.errorState.set('Error updating task');
      console.error('Error updating task:', error);
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const success = await this.db.deleteTask(id);
      if (success) {
        this.tasksState.update(tasks => tasks.filter(t => t.id !== id));
        if (this.selectedTaskState()?.id === id) {
          this.selectedTaskState.set(null);
        }
      }
      return success;
    } catch (error) {
      this.errorState.set('Error deleting task');
      console.error('Error deleting task:', error);
      return false;
    } finally {
      this.loadingState.set(false);
    }
  }

  clearSelectedTask(): void {
    this.selectedTaskState.set(null);
  }
}
