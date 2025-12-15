import { AgentTask, TaskPriority, TaskStatus } from '../models/agent-task.model';

export class PriorityStrategy {
  /**
   * Ordena tareas por prioridad y otros criterios
   */
  static sortTasks(tasks: AgentTask[]): AgentTask[] {
    return [...tasks].sort((a, b) => {
      // 1. Primero por estado (bloqueadas al final)
      if (a.status === TaskStatus.BLOCKED && b.status !== TaskStatus.BLOCKED) {
        return 1;
      }
      if (a.status !== TaskStatus.BLOCKED && b.status === TaskStatus.BLOCKED) {
        return -1;
      }

      // 2. Luego por prioridad
      const priorityDiff = this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // 3. Luego por dependencias (tareas sin dependencias primero)
      const depDiff = a.dependencies.length - b.dependencies.length;
      if (depDiff !== 0) {
        return depDiff;
      }

      // 4. Finalmente por fecha de creación (más antiguas primero)
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  /**
   * Obtiene el valor numérico de una prioridad
   */
  private static getPriorityValue(priority: TaskPriority): number {
    const values: Record<TaskPriority, number> = {
      [TaskPriority.CRITICAL]: 4,
      [TaskPriority.HIGH]: 3,
      [TaskPriority.MEDIUM]: 2,
      [TaskPriority.LOW]: 1
    };

    return values[priority];
  }

  /**
   * Calcula la prioridad dinámica basada en múltiples factores
   */
  static calculateDynamicPriority(task: AgentTask): number {
    let priority = this.getPriorityValue(task.priority);

    // Aumentar prioridad si está cerca del deadline
    if (task.estimatedDuration) {
      const now = Date.now();
      const created = task.createdAt.getTime();
      const elapsed = now - created;
      const elapsedRatio = elapsed / task.estimatedDuration;

      if (elapsedRatio > 0.8) {
        priority += 2; // Urgente
      } else if (elapsedRatio > 0.5) {
        priority += 1; // Incrementar prioridad
      }
    }

    // Reducir prioridad si tiene muchas dependencias sin resolver
    const unresolvedDeps = task.dependencies.filter(dep => {
      // Aquí se debería verificar si las dependencias están completadas
      return true; // Simplificado
    });

    if (unresolvedDeps.length > 3) {
      priority -= 1;
    }

    return Math.max(0, priority); // No puede ser negativa
  }

  /**
   * Determina si una tarea debe ser escalada
   */
  static shouldEscalate(task: AgentTask): boolean {
    // Escalar si ha fallado múltiples veces
    if (task.metadata?.failCount && task.metadata.failCount > 2) {
      return true;
    }

    // Escalar si está bloqueada por mucho tiempo
    if (task.status === TaskStatus.BLOCKED && task.metadata?.blockedAt) {
      const blockedTime = Date.now() - new Date(task.metadata.blockedAt).getTime();
      const oneHour = 60 * 60 * 1000;
      if (blockedTime > oneHour) {
        return true;
      }
    }

    // Escalar si lleva mucho tiempo en progreso
    if (task.status === TaskStatus.IN_PROGRESS && task.startedAt) {
      const elapsed = Date.now() - task.startedAt.getTime();
      const estimated = task.estimatedDuration || 60000;
      if (elapsed > estimated * 2) {
        return true;
      }
    }

    return false;
  }

  /**
   * Ajusta prioridades de tareas relacionadas
   */
  static adjustRelatedTasksPriority(completedTask: AgentTask, allTasks: AgentTask[]): AgentTask[] {
    return allTasks.map(task => {
      // Si esta tarea dependía de la completada, aumentar su prioridad
      if (task.dependencies.includes(completedTask.id)) {
        const currentPriority = this.getPriorityValue(task.priority);
        const newPriorityValue = Math.min(4, currentPriority + 1);

        const newPriority = this.valueToTaskPriority(newPriorityValue);

        return { ...task, priority: newPriority };
      }

      return task;
    });
  }

  private static valueToTaskPriority(value: number): TaskPriority {
    if (value >= 4) return TaskPriority.CRITICAL;
    if (value >= 3) return TaskPriority.HIGH;
    if (value >= 2) return TaskPriority.MEDIUM;
    return TaskPriority.LOW;
  }
}
