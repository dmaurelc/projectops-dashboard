import { Agent, AgentType } from '../models/agent.model';
import { AgentTask, TaskType } from '../models/agent-task.model';

export class TaskAssignmentStrategy {
  /**
   * Asigna una tarea al mejor agente disponible basado en habilidades y carga de trabajo
   */
  static assignTask(task: AgentTask, availableAgents: Agent[]): Agent | null {
    if (availableAgents.length === 0) {
      return null;
    }

    // 1. Filtrar por tipo de agente apropiado
    const suitableAgents = this.filterByTaskType(task.type, availableAgents);

    if (suitableAgents.length === 0) {
      return availableAgents[0]; // Fallback al primer agente disponible
    }

    // 2. Filtrar por habilidades requeridas
    const skilledAgents = this.filterBySkills(task, suitableAgents);

    if (skilledAgents.length === 0) {
      return suitableAgents[0];
    }

    // 3. Seleccionar el agente con menor carga de trabajo
    const bestAgent = this.selectByWorkload(skilledAgents);

    return bestAgent;
  }

  /**
   * Filtra agentes por tipo de tarea
   */
  private static filterByTaskType(taskType: TaskType, agents: Agent[]): Agent[] {
    const taskTypeToAgentType: Record<TaskType, AgentType[]> = {
      [TaskType.DATABASE_OPERATION]: [AgentType.DATABASE],
      [TaskType.UI_DESIGN]: [AgentType.UI_UX],
      [TaskType.CODE_GENERATION]: [AgentType.FULLSTACK],
      [TaskType.TESTING]: [AgentType.TESTER],
      [TaskType.SECURITY_AUDIT]: [AgentType.SECURITY],
      [TaskType.OPTIMIZATION]: [AgentType.OPTIMIZATION],
      [TaskType.DOCUMENTATION]: [AgentType.DOCUMENTATION],
      [TaskType.CODE_REVIEW]: [AgentType.FULLSTACK, AgentType.SECURITY],
      [TaskType.REFACTORING]: [AgentType.FULLSTACK, AgentType.OPTIMIZATION],
      [TaskType.BUG_FIX]: [AgentType.FULLSTACK, AgentType.TESTER]
    };

    const suitableTypes = taskTypeToAgentType[taskType] || [];

    return agents.filter(agent => suitableTypes.includes(agent.type));
  }

  /**
   * Filtra agentes por habilidades requeridas
   */
  private static filterBySkills(task: AgentTask, agents: Agent[]): Agent[] {
    const requiredSkills = task.metadata?.requiredSkills as string[] || [];

    if (requiredSkills.length === 0) {
      return agents;
    }

    return agents.filter(agent =>
      requiredSkills.every(required =>
        agent.skills.some(skill =>
          skill.name.toLowerCase().includes(required.toLowerCase())
        )
      )
    );
  }

  /**
   * Selecciona el agente con menor carga de trabajo
   */
  private static selectByWorkload(agents: Agent[]): Agent {
    return agents.reduce((best, current) => {
      const bestLoad = best.tasksInQueue + (best.currentTask ? 1 : 0);
      const currentLoad = current.tasksInQueue + (current.currentTask ? 1 : 0);

      if (currentLoad < bestLoad) {
        return current;
      }

      // Si tienen la misma carga, elegir el de mayor tasa de éxito
      if (currentLoad === bestLoad && current.successRate > best.successRate) {
        return current;
      }

      return best;
    });
  }

  /**
   * Rebalancea tareas entre agentes
   */
  static rebalanceTasks(agents: Agent[], tasks: AgentTask[]): Map<string, string> {
    const assignments = new Map<string, string>();

    const pendingTasks = tasks.filter(t => !t.assignedTo || t.status === 'pending');

    pendingTasks.forEach(task => {
      const agent = this.assignTask(task, agents);
      if (agent) {
        assignments.set(task.id, agent.id);
      }
    });

    return assignments;
  }
}
