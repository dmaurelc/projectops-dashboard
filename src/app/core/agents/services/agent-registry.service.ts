import { Injectable, signal, computed, inject } from '@angular/core';
import { Agent, AgentType, AgentStatus, AgentMetrics } from '../models/agent.model';
import { AgentState, HealthStatus } from '../models/agent-state.model';
import { TaskType } from '../models/agent-task.model';

@Injectable({
  providedIn: 'root'
})
export class AgentRegistryService {
  private agentsState = signal<Agent[]>([]);
  private agentStatesMap = signal<Map<string, AgentState>>(new Map());

  readonly agents = this.agentsState.asReadonly();

  readonly availableAgents = computed(() =>
    this.agentsState().filter(agent =>
      agent.status === AgentStatus.IDLE || agent.status === AgentStatus.WAITING
    )
  );

  readonly activeAgents = computed(() =>
    this.agentsState().filter(agent =>
      agent.status === AgentStatus.WORKING || agent.status === AgentStatus.IDLE
    )
  );

  readonly agentsByType = computed(() => {
    const map = new Map<AgentType, Agent[]>();
    this.agentsState().forEach(agent => {
      const agents = map.get(agent.type) || [];
      agents.push(agent);
      map.set(agent.type, agents);
    });
    return map;
  });

  registerAgent(agent: Agent): void {
    this.agentsState.update(agents => {
      const exists = agents.find(a => a.id === agent.id);
      if (exists) {
        console.warn(`Agent with id ${agent.id} already registered`);
        return agents;
      }
      return [...agents, agent];
    });

    const initialState: AgentState = {
      agentId: agent.id,
      currentStatus: agent.status,
      taskQueue: [],
      messageQueue: [],
      workload: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      lastHeartbeat: new Date(),
      healthStatus: HealthStatus.HEALTHY,
      performance: {
        tasksPerHour: 0,
        averageTaskDuration: 0,
        successRate: 100,
        errorRate: 0,
        responseTime: 0,
        throughput: 0,
        uptime: 0
      }
    };

    this.agentStatesMap.update(map => {
      const newMap = new Map(map);
      newMap.set(agent.id, initialState);
      return newMap;
    });
  }

  unregisterAgent(agentId: string): void {
    this.agentsState.update(agents =>
      agents.filter(a => a.id !== agentId)
    );

    this.agentStatesMap.update(map => {
      const newMap = new Map(map);
      newMap.delete(agentId);
      return newMap;
    });
  }

  getAgentById(agentId: string): Agent | undefined {
    return this.agentsState().find(a => a.id === agentId);
  }

  getAgentsByType(type: AgentType): Agent[] {
    return this.agentsState().filter(a => a.type === type);
  }

  getAgentsByStatus(status: AgentStatus): Agent[] {
    return this.agentsState().filter(a => a.status === status);
  }

  updateAgentStatus(agentId: string, status: AgentStatus): void {
    this.agentsState.update(agents =>
      agents.map(agent =>
        agent.id === agentId
          ? { ...agent, status, lastActiveAt: new Date() }
          : agent
      )
    );

    this.agentStatesMap.update(map => {
      const newMap = new Map(map);
      const state = newMap.get(agentId);
      if (state) {
        newMap.set(agentId, {
          ...state,
          currentStatus: status,
          lastHeartbeat: new Date()
        });
      }
      return newMap;
    });
  }

  getAgentState(agentId: string): AgentState | undefined {
    return this.agentStatesMap().get(agentId);
  }

  updateAgentState(agentId: string, state: Partial<AgentState>): void {
    this.agentStatesMap.update(map => {
      const newMap = new Map(map);
      const currentState = newMap.get(agentId);
      if (currentState) {
        newMap.set(agentId, { ...currentState, ...state });
      }
      return newMap;
    });
  }

  findBestAgentForTask(taskType: TaskType, requiredSkills?: string[]): Agent | null {
    const availableAgents = this.availableAgents();

    if (availableAgents.length === 0) {
      return null;
    }

    const agentTypeMapping: Record<TaskType, AgentType> = {
      [TaskType.DATABASE_OPERATION]: AgentType.DATABASE,
      [TaskType.UI_DESIGN]: AgentType.UI_UX,
      [TaskType.CODE_GENERATION]: AgentType.FULLSTACK,
      [TaskType.TESTING]: AgentType.TESTER,
      [TaskType.SECURITY_AUDIT]: AgentType.SECURITY,
      [TaskType.OPTIMIZATION]: AgentType.OPTIMIZATION,
      [TaskType.DOCUMENTATION]: AgentType.DOCUMENTATION,
      [TaskType.CODE_REVIEW]: AgentType.FULLSTACK,
      [TaskType.REFACTORING]: AgentType.FULLSTACK,
      [TaskType.BUG_FIX]: AgentType.FULLSTACK
    };

    const preferredType = agentTypeMapping[taskType];

    let candidates = availableAgents.filter(a => a.type === preferredType);

    if (requiredSkills && requiredSkills.length > 0) {
      candidates = candidates.filter(agent =>
        requiredSkills.every(requiredSkill =>
          agent.skills.some(skill => skill.name.toLowerCase().includes(requiredSkill.toLowerCase()))
        )
      );
    }

    if (candidates.length === 0) {
      candidates = availableAgents;
    }

    candidates.sort((a, b) => {
      const stateA = this.getAgentState(a.id);
      const stateB = this.getAgentState(b.id);

      const workloadA = stateA?.workload || 0;
      const workloadB = stateB?.workload || 0;

      if (workloadA !== workloadB) {
        return workloadA - workloadB;
      }

      return b.successRate - a.successRate;
    });

    return candidates[0] || null;
  }

  getAgentMetrics(agentId: string): AgentMetrics | null {
    const agent = this.getAgentById(agentId);
    const state = this.getAgentState(agentId);

    if (!agent || !state) {
      return null;
    }

    const totalTasks = agent.tasksCompleted;
    const failedTasks = Math.round(totalTasks * (1 - agent.successRate / 100));

    return {
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      totalTasksCompleted: agent.tasksCompleted,
      totalTasksFailed: failedTasks,
      averageExecutionTime: state.performance.averageTaskDuration,
      successRate: agent.successRate,
      currentStatus: agent.status,
      uptime: state.performance.uptime,
      lastError: undefined
    };
  }

  getAllMetrics(): AgentMetrics[] {
    return this.agentsState()
      .map(agent => this.getAgentMetrics(agent.id))
      .filter(metrics => metrics !== null) as AgentMetrics[];
  }
}
