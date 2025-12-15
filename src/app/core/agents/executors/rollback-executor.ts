import { AgentTask } from '../models/agent-task.model';

export interface RollbackPoint {
  id: string;
  timestamp: Date;
  taskId: string;
  description: string;
  state: any;
  canRestore: boolean;
}

export interface RollbackResult {
  success: boolean;
  restoredTo?: RollbackPoint;
  error?: string;
  changesReverted: string[];
}

export class RollbackExecutor {
  private static rollbackPoints: Map<string, RollbackPoint[]> = new Map();

  /**
   * Crea un punto de rollback antes de ejecutar una tarea
   */
  static createRollbackPoint(
    task: AgentTask,
    currentState: any,
    description?: string
  ): RollbackPoint {
    const rollbackPoint: RollbackPoint = {
      id: `rollback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      taskId: task.id,
      description: description || `Rollback point for ${task.title}`,
      state: JSON.parse(JSON.stringify(currentState)), // Deep clone
      canRestore: true
    };

    const taskRollbacks = this.rollbackPoints.get(task.id) || [];
    taskRollbacks.push(rollbackPoint);
    this.rollbackPoints.set(task.id, taskRollbacks);

    // Mantener solo los últimos 10 puntos de rollback por tarea
    if (taskRollbacks.length > 10) {
      taskRollbacks.shift();
    }

    return rollbackPoint;
  }

  /**
   * Realiza rollback a un punto específico
   */
  static async rollbackToPoint(
    rollbackPointId: string
  ): Promise<RollbackResult> {
    try {
      // Buscar el punto de rollback
      let foundPoint: RollbackPoint | undefined;
      let taskId: string | undefined;

      for (const [id, points] of this.rollbackPoints.entries()) {
        const point = points.find(p => p.id === rollbackPointId);
        if (point) {
          foundPoint = point;
          taskId = id;
          break;
        }
      }

      if (!foundPoint || !taskId) {
        return {
          success: false,
          error: 'Rollback point not found',
          changesReverted: []
        };
      }

      if (!foundPoint.canRestore) {
        return {
          success: false,
          error: 'Rollback point cannot be restored',
          changesReverted: []
        };
      }

      // Simular restauración del estado
      const changesReverted = await this.revertChanges(foundPoint);

      // Invalidar puntos de rollback posteriores
      const taskRollbacks = this.rollbackPoints.get(taskId) || [];
      const pointIndex = taskRollbacks.findIndex(p => p.id === rollbackPointId);

      if (pointIndex >= 0) {
        const laterPoints = taskRollbacks.slice(pointIndex + 1);
        laterPoints.forEach(p => p.canRestore = false);
      }

      return {
        success: true,
        restoredTo: foundPoint,
        changesReverted
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        changesReverted: []
      };
    }
  }

  /**
   * Realiza rollback al último punto guardado de una tarea
   */
  static async rollbackLastPoint(taskId: string): Promise<RollbackResult> {
    const taskRollbacks = this.rollbackPoints.get(taskId) || [];

    if (taskRollbacks.length === 0) {
      return {
        success: false,
        error: 'No rollback points available for this task',
        changesReverted: []
      };
    }

    const lastPoint = taskRollbacks[taskRollbacks.length - 1];

    if (!lastPoint.canRestore) {
      return {
        success: false,
        error: 'Last rollback point cannot be restored',
        changesReverted: []
      };
    }

    return this.rollbackToPoint(lastPoint.id);
  }

  /**
   * Revierte cambios realizados
   */
  private static async revertChanges(rollbackPoint: RollbackPoint): Promise<string[]> {
    const changes: string[] = [];

    // Simulación de reversión de cambios
    // En una implementación real, esto revertiría:
    // - Cambios en archivos
    // - Cambios en base de datos
    // - Estado de la aplicación
    // - Configuraciones

    changes.push('Reverted file modifications');
    changes.push('Restored database state');
    changes.push('Reset application configuration');

    // Simular tiempo de reversión
    await new Promise(resolve => setTimeout(resolve, 500));

    return changes;
  }

  /**
   * Obtiene todos los puntos de rollback de una tarea
   */
  static getRollbackPoints(taskId: string): RollbackPoint[] {
    return this.rollbackPoints.get(taskId) || [];
  }

  /**
   * Obtiene el último punto de rollback de una tarea
   */
  static getLastRollbackPoint(taskId: string): RollbackPoint | null {
    const points = this.rollbackPoints.get(taskId) || [];
    return points.length > 0 ? points[points.length - 1] : null;
  }

  /**
   * Limpia los puntos de rollback de una tarea completada
   */
  static clearRollbackPoints(taskId: string): void {
    this.rollbackPoints.delete(taskId);
  }

  /**
   * Limpia todos los puntos de rollback antiguos
   */
  static cleanupOldRollbackPoints(olderThanMs: number = 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - olderThanMs;

    for (const [taskId, points] of this.rollbackPoints.entries()) {
      const validPoints = points.filter(
        point => point.timestamp.getTime() > cutoffTime
      );

      if (validPoints.length === 0) {
        this.rollbackPoints.delete(taskId);
      } else {
        this.rollbackPoints.set(taskId, validPoints);
      }
    }
  }

  /**
   * Obtiene estadísticas de rollback
   */
  static getStatistics() {
    let totalPoints = 0;
    let restorablePoints = 0;

    for (const points of this.rollbackPoints.values()) {
      totalPoints += points.length;
      restorablePoints += points.filter(p => p.canRestore).length;
    }

    return {
      totalTasks: this.rollbackPoints.size,
      totalPoints,
      restorablePoints,
      nonRestorablePoints: totalPoints - restorablePoints
    };
  }
}
