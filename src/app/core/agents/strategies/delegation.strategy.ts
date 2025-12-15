import { Agent, AgentType } from '../models/agent.model';
import { AgentTask, TaskType } from '../models/agent-task.model';

export interface DelegationDecision {
  shouldDelegate: boolean;
  targetAgent?: Agent;
  reason: string;
  delegationType: 'full' | 'partial' | 'collaborative';
}

export class DelegationStrategy {
  /**
   * Decide si una tarea debe ser delegada a otro agente
   */
  static decideDelegation(
    currentAgent: Agent,
    task: AgentTask,
    availableAgents: Agent[]
  ): DelegationDecision {
    // No delegar si no hay otros agentes
    if (availableAgents.length === 0) {
      return {
        shouldDelegate: false,
        reason: 'No available agents for delegation',
        delegationType: 'full'
      };
    }

    // Verificar sobrecarga del agente actual
    if (this.isAgentOverloaded(currentAgent)) {
      const suitableAgent = this.findLessLoadedAgent(currentAgent.type, availableAgents);
      if (suitableAgent) {
        return {
          shouldDelegate: true,
          targetAgent: suitableAgent,
          reason: 'Current agent is overloaded',
          delegationType: 'full'
        };
      }
    }

    // Verificar si otro agente es más adecuado
    const betterAgent = this.findBetterAgent(currentAgent, task, availableAgents);
    if (betterAgent) {
      return {
        shouldDelegate: true,
        targetAgent: betterAgent,
        reason: 'Better suited agent found',
        delegationType: 'full'
      };
    }

    // Verificar si requiere colaboración
    if (this.requiresCollaboration(task)) {
      const collaborator = this.findCollaborator(task, availableAgents);
      if (collaborator) {
        return {
          shouldDelegate: true,
          targetAgent: collaborator,
          reason: 'Task requires collaboration',
          delegationType: 'collaborative'
        };
      }
    }

    return {
      shouldDelegate: false,
      reason: 'Current agent is optimal for this task',
      delegationType: 'full'
    };
  }

  /**
   * Verifica si un agente está sobrecargado
   */
  private static isAgentOverloaded(agent: Agent): boolean {
    const maxConcurrentTasks = agent.constraints.maxConcurrentTasks;
    const currentLoad = agent.tasksInQueue + (agent.currentTask ? 1 : 0);

    return currentLoad >= maxConcurrentTasks;
  }

  /**
   * Encuentra un agente del mismo tipo con menos carga
   */
  private static findLessLoadedAgent(
    agentType: AgentType,
    availableAgents: Agent[]
  ): Agent | null {
    const sameTypeAgents = availableAgents.filter(a => a.type === agentType);

    if (sameTypeAgents.length === 0) {
      return null;
    }

    return sameTypeAgents.reduce((best, current) => {
      const bestLoad = best.tasksInQueue + (best.currentTask ? 1 : 0);
      const currentLoad = current.tasksInQueue + (current.currentTask ? 1 : 0);

      return currentLoad < bestLoad ? current : best;
    });
  }

  /**
   * Encuentra un agente mejor capacitado para la tarea
   */
  private static findBetterAgent(
    currentAgent: Agent,
    task: AgentTask,
    availableAgents: Agent[]
  ): Agent | null {
    const requiredSkills = task.metadata?.requiredSkills as string[] || [];

    if (requiredSkills.length === 0) {
      return null;
    }

    // Calcular score del agente actual
    const currentScore = this.calculateSkillScore(currentAgent, requiredSkills);

    // Buscar agente con mejor score
    for (const agent of availableAgents) {
      if (agent.id === currentAgent.id) {
        continue;
      }

      const agentScore = this.calculateSkillScore(agent, requiredSkills);

      // Si el otro agente tiene significativamente mejor score
      if (agentScore > currentScore * 1.5) {
        return agent;
      }
    }

    return null;
  }

  /**
   * Calcula un score de habilidades para una tarea
   */
  private static calculateSkillScore(agent: Agent, requiredSkills: string[]): number {
    let score = 0;

    requiredSkills.forEach(required => {
      const matchingSkill = agent.skills.find(skill =>
        skill.name.toLowerCase().includes(required.toLowerCase())
      );

      if (matchingSkill) {
        // Asignar puntos basados en el nivel de habilidad
        const levelScores = {
          'beginner': 1,
          'intermediate': 2,
          'advanced': 3,
          'expert': 4,
          'master': 5
        };

        score += levelScores[matchingSkill.level] || 0;
      }
    });

    return score;
  }

  /**
   * Verifica si una tarea requiere colaboración
   */
  private static requiresCollaboration(task: AgentTask): boolean {
    // Tareas complejas que cruzan dominios
    const collaborativeTypes: TaskType[] = [
      TaskType.CODE_REVIEW, // Fullstack + Security
      TaskType.REFACTORING  // Fullstack + Optimization
    ];

    return collaborativeTypes.includes(task.type);
  }

  /**
   * Encuentra un agente colaborador apropiado
   */
  private static findCollaborator(
    task: AgentTask,
    availableAgents: Agent[]
  ): Agent | null {
    const collaborationMap: Record<TaskType, AgentType[]> = {
      [TaskType.CODE_REVIEW]: [AgentType.SECURITY, AgentType.FULLSTACK],
      [TaskType.REFACTORING]: [AgentType.OPTIMIZATION, AgentType.FULLSTACK],
      [TaskType.CODE_GENERATION]: [AgentType.TESTER, AgentType.DOCUMENTATION],
      [TaskType.DATABASE_OPERATION]: [AgentType.SECURITY],
      [TaskType.UI_DESIGN]: [AgentType.FULLSTACK],
      [TaskType.TESTING]: [AgentType.FULLSTACK],
      [TaskType.SECURITY_AUDIT]: [AgentType.FULLSTACK],
      [TaskType.OPTIMIZATION]: [AgentType.TESTER],
      [TaskType.DOCUMENTATION]: [AgentType.FULLSTACK],
      [TaskType.BUG_FIX]: [AgentType.TESTER]
    };

    const suitableTypes = collaborationMap[task.type] || [];

    const collaborators = availableAgents.filter(agent =>
      suitableTypes.includes(agent.type)
    );

    return collaborators.length > 0 ? collaborators[0] : null;
  }

  /**
   * Divide una tarea compleja en subtareas para delegación
   */
  static splitTask(task: AgentTask): AgentTask[] {
    // Simplificado - en una implementación real sería más sofisticado
    if (!task.metadata?.complexity || task.metadata.complexity < 5) {
      return [task];
    }

    const subtasks: AgentTask[] = [];
    const now = new Date();

    // Ejemplo: dividir en análisis, implementación, testing
    const phases = [
      { type: TaskType.CODE_GENERATION, title: `${task.title} - Analysis` },
      { type: TaskType.CODE_GENERATION, title: `${task.title} - Implementation` },
      { type: TaskType.TESTING, title: `${task.title} - Testing` }
    ];

    phases.forEach((phase, index) => {
      subtasks.push({
        ...task,
        id: `${task.id}-subtask-${index + 1}`,
        title: phase.title,
        type: phase.type,
        dependencies: index > 0 ? [`${task.id}-subtask-${index}`] : [],
        createdAt: now,
        updatedAt: now
      });
    });

    return subtasks;
  }
}
