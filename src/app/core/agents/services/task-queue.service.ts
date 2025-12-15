import { Injectable, signal, computed } from '@angular/core';
import {
  AgentTask,
  AgentTaskCreateDto,
  TaskStatus,
  TaskPriority,
  TaskType
} from '../models/agent-task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskQueueService {
  private tasksState = signal<AgentTask[]>([]);
  private taskIdCounter = signal<number>(1);

  readonly tasks = this.tasksState.asReadonly();

  readonly pendingTasks = computed(() =>
    this.tasksState().filter(task => task.status === TaskStatus.PENDING)
  );

  readonly assignedTasks = computed(() =>
    this.tasksState().filter(task => task.status === TaskStatus.ASSIGNED)
  );

  readonly inProgressTasks = computed(() =>
    this.tasksState().filter(task => task.status === TaskStatus.IN_PROGRESS)
  );

  readonly completedTasks = computed(() =>
    this.tasksState().filter(task => task.status === TaskStatus.COMPLETED)
  );

  readonly failedTasks = computed(() =>
    this.tasksState().filter(task => task.status === TaskStatus.FAILED)
  );

  readonly blockedTasks = computed(() =>
    this.tasksState().filter(task => task.status === TaskStatus.BLOCKED)
  );

  readonly tasksByPriority = computed(() => {
    const map = new Map<TaskPriority, AgentTask[]>();
    this.tasksState().forEach(task => {
      const tasks = map.get(task.priority) || [];
      tasks.push(task);
      map.set(task.priority, tasks);
    });
    return map;
  });

  readonly tasksByType = computed(() => {
    const map = new Map<TaskType, AgentTask[]>();
    this.tasksState().forEach(task => {
      const tasks = map.get(task.type) || [];
      tasks.push(task);
      map.set(task.type, tasks);
    });
    return map;
  });

  enqueue(taskDto: AgentTaskCreateDto): AgentTask {
    const now = new Date();
    const newTask: AgentTask = {
      id: this.generateTaskId(),
      title: taskDto.title,
      description: taskDto.description,
      type: taskDto.type,
      priority: taskDto.priority,
      status: TaskStatus.PENDING,
      assignedTo: taskDto.assignedTo,
      dependencies: taskDto.dependencies || [],
      estimatedDuration: taskDto.estimatedDuration,
      metadata: taskDto.metadata || {},
      createdAt: now,
      updatedAt: now
    };

    this.tasksState.update(tasks => [...tasks, newTask]);

    return newTask;
  }

  dequeue(): AgentTask | null {
    const availableTasks = this.getAvailableTasks();

    if (availableTasks.length === 0) {
      return null;
    }

    return availableTasks[0];
  }

  getNextTask(agentId?: string): AgentTask | null {
    const availableTasks = agentId
      ? this.getAvailableTasks().filter(task => task.assignedTo === agentId)
      : this.getAvailableTasks();

    if (availableTasks.length === 0) {
      return null;
    }

    return availableTasks[0];
  }

  private getAvailableTasks(): AgentTask[] {
    const pending = this.pendingTasks();

    const tasksWithoutBlockingDeps = pending.filter(task => {
      if (task.dependencies.length === 0) {
        return true;
      }

      return task.dependencies.every(depId => {
        const depTask = this.getTaskById(depId);
        return depTask?.status === TaskStatus.COMPLETED;
      });
    });

    return this.sortTasksByPriority(tasksWithoutBlockingDeps);
  }

  private sortTasksByPriority(tasks: AgentTask[]): AgentTask[] {
    const priorityOrder: Record<TaskPriority, number> = {
      [TaskPriority.CRITICAL]: 4,
      [TaskPriority.HIGH]: 3,
      [TaskPriority.MEDIUM]: 2,
      [TaskPriority.LOW]: 1
    };

    return [...tasks].sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  getTaskById(taskId: string): AgentTask | undefined {
    return this.tasksState().find(task => task.id === taskId);
  }

  getTasksByAgent(agentId: string): AgentTask[] {
    return this.tasksState().filter(task => task.assignedTo === agentId);
  }

  updateTask(taskId: string, updates: Partial<AgentTask>): AgentTask | null {
    let updatedTask: AgentTask | null = null;

    this.tasksState.update(tasks =>
      tasks.map(task => {
        if (task.id === taskId) {
          updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date()
          };
          return updatedTask;
        }
        return task;
      })
    );

    return updatedTask;
  }

  assignTask(taskId: string, agentId: string): boolean {
    const task = this.getTaskById(taskId);

    if (!task || task.status !== TaskStatus.PENDING) {
      return false;
    }

    this.updateTask(taskId, {
      assignedTo: agentId,
      status: TaskStatus.ASSIGNED
    });

    return true;
  }

  startTask(taskId: string): boolean {
    const task = this.getTaskById(taskId);

    if (!task || (task.status !== TaskStatus.PENDING && task.status !== TaskStatus.ASSIGNED)) {
      return false;
    }

    this.updateTask(taskId, {
      status: TaskStatus.IN_PROGRESS,
      startedAt: new Date()
    });

    return true;
  }

  completeTask(taskId: string, result: any): boolean {
    const task = this.getTaskById(taskId);

    if (!task || task.status !== TaskStatus.IN_PROGRESS) {
      return false;
    }

    const completedAt = new Date();
    const actualDuration = task.startedAt
      ? completedAt.getTime() - task.startedAt.getTime()
      : undefined;

    this.updateTask(taskId, {
      status: TaskStatus.COMPLETED,
      completedAt,
      actualDuration,
      result
    });

    return true;
  }

  failTask(taskId: string, error: any): boolean {
    const task = this.getTaskById(taskId);

    if (!task) {
      return false;
    }

    this.updateTask(taskId, {
      status: TaskStatus.FAILED,
      completedAt: new Date(),
      error
    });

    return true;
  }

  cancelTask(taskId: string): boolean {
    const task = this.getTaskById(taskId);

    if (!task || task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED) {
      return false;
    }

    this.updateTask(taskId, {
      status: TaskStatus.CANCELLED,
      completedAt: new Date()
    });

    return true;
  }

  blockTask(taskId: string, reason: string): boolean {
    const task = this.getTaskById(taskId);

    if (!task) {
      return false;
    }

    this.updateTask(taskId, {
      status: TaskStatus.BLOCKED,
      metadata: {
        ...task.metadata,
        blockReason: reason,
        blockedAt: new Date()
      }
    });

    return true;
  }

  unblockTask(taskId: string): boolean {
    const task = this.getTaskById(taskId);

    if (!task || task.status !== TaskStatus.BLOCKED) {
      return false;
    }

    this.updateTask(taskId, {
      status: TaskStatus.PENDING,
      metadata: {
        ...task.metadata,
        blockReason: undefined,
        blockedAt: undefined,
        unblockedAt: new Date()
      }
    });

    return true;
  }

  clearCompletedTasks(): void {
    this.tasksState.update(tasks =>
      tasks.filter(task =>
        task.status !== TaskStatus.COMPLETED &&
        task.status !== TaskStatus.CANCELLED
      )
    );
  }

  clearAllTasks(): void {
    this.tasksState.set([]);
    this.taskIdCounter.set(1);
  }

  getQueueStatistics() {
    const tasks = this.tasksState();

    return {
      total: tasks.length,
      pending: this.pendingTasks().length,
      assigned: this.assignedTasks().length,
      inProgress: this.inProgressTasks().length,
      completed: this.completedTasks().length,
      failed: this.failedTasks().length,
      blocked: this.blockedTasks().length,
      cancelled: tasks.filter(t => t.status === TaskStatus.CANCELLED).length,
      averageWaitTime: this.calculateAverageWaitTime(),
      averageExecutionTime: this.calculateAverageExecutionTime()
    };
  }

  private calculateAverageWaitTime(): number {
    const completedTasks = this.completedTasks();

    if (completedTasks.length === 0) {
      return 0;
    }

    const totalWaitTime = completedTasks.reduce((sum, task) => {
      if (task.startedAt) {
        return sum + (task.startedAt.getTime() - task.createdAt.getTime());
      }
      return sum;
    }, 0);

    return totalWaitTime / completedTasks.length;
  }

  private calculateAverageExecutionTime(): number {
    const completedTasks = this.completedTasks();

    if (completedTasks.length === 0) {
      return 0;
    }

    const totalExecutionTime = completedTasks.reduce((sum, task) => {
      return sum + (task.actualDuration || 0);
    }, 0);

    return totalExecutionTime / completedTasks.length;
  }

  private generateTaskId(): string {
    const id = this.taskIdCounter();
    this.taskIdCounter.update(counter => counter + 1);
    return `task-${id}`;
  }
}
