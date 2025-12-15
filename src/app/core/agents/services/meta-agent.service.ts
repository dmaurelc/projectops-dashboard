import { Injectable, inject, signal, computed } from '@angular/core';
import { AgentRegistryService } from './agent-registry.service';
import { TaskQueueService } from './task-queue.service';
import { AgentCommunicationService } from './agent-communication.service';
import { AgentLoggerService, LogCategory } from './agent-logger.service';
import {
  AgentTask,
  AgentTaskCreateDto,
  TaskType,
  TaskPriority,
  TaskStatus
} from '../models/agent-task.model';
import { Agent, AgentType, AgentStatus } from '../models/agent.model';
import { MessagePriority } from '../models/agent-message.model';

export interface UserRequest {
  description: string;
  priority: TaskPriority;
  metadata?: Record<string, any>;
}

export interface TaskDecomposition {
  mainTask: string;
  subtasks: SubTask[];
  dependencies: TaskDependency[];
  estimatedTotalDuration: number;
}

export interface SubTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  assignedAgentType: AgentType;
  estimatedDuration: number;
  dependencies: string[];
}

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
}

export interface ExecutionPlan {
  tasks: AgentTask[];
  executionOrder: string[][];
  estimatedDuration: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetaAgentService {
  private registry = inject(AgentRegistryService);
  private taskQueue = inject(TaskQueueService);
  private communication = inject(AgentCommunicationService);
  private logger = inject(AgentLoggerService);

  private readonly META_AGENT_ID = 'meta-agent-pm';

  private activeExecutionsState = signal<Map<string, ExecutionPlan>>(new Map());
  private executionHistoryState = signal<Array<{
    requestId: string;
    request: UserRequest;
    plan: ExecutionPlan;
    status: 'completed' | 'failed' | 'in_progress';
    startedAt: Date;
    completedAt?: Date;
  }>>([]);

  readonly activeExecutions = this.activeExecutionsState.asReadonly();
  readonly executionHistory = this.executionHistoryState.asReadonly();

  readonly activeExecutionsCount = computed(() => this.activeExecutionsState().size);

  async processUserRequest(request: UserRequest): Promise<string> {
    const requestId = this.generateRequestId();
    this.logger.info(
      this.META_AGENT_ID,
      LogCategory.TASK_EXECUTION,
      `Processing user request: ${request.description}`
    );

    try {
      const analysis = await this.analyzeRequest(request);

      const decomposition = await this.decomposeTasks(analysis);

      const executionPlan = await this.createExecutionPlan(decomposition);

      const assignments = await this.assignAgents(executionPlan);

      this.activeExecutionsState.update(map => {
        const newMap = new Map(map);
        newMap.set(requestId, executionPlan);
        return newMap;
      });

      this.executionHistoryState.update(history => [
        ...history,
        {
          requestId,
          request,
          plan: executionPlan,
          status: 'in_progress',
          startedAt: new Date()
        }
      ]);

      await this.executeWithCoordination(requestId, executionPlan);

      const result = await this.consolidateResults(requestId);

      this.logger.info(
        this.META_AGENT_ID,
        LogCategory.TASK_EXECUTION,
        `User request completed successfully`,
        { requestId, result }
      );

      return requestId;
    } catch (error) {
      this.logger.error(
        this.META_AGENT_ID,
        LogCategory.TASK_EXECUTION,
        `Failed to process user request`,
        { error, request }
      );

      this.executionHistoryState.update(history =>
        history.map(h =>
          h.requestId === requestId
            ? { ...h, status: 'failed', completedAt: new Date() }
            : h
        )
      );

      throw error;
    }
  }

  private async analyzeRequest(request: UserRequest): Promise<{
    requestType: string;
    complexity: number;
    requiredAgentTypes: AgentType[];
    keywords: string[];
  }> {
    await this.simulateDelay(100);

    const description = request.description.toLowerCase();
    const requiredAgentTypes: AgentType[] = [];

    if (description.includes('database') || description.includes('data') || description.includes('crud')) {
      requiredAgentTypes.push(AgentType.DATABASE);
    }
    if (description.includes('ui') || description.includes('component') || description.includes('design')) {
      requiredAgentTypes.push(AgentType.UI_UX);
    }
    if (description.includes('code') || description.includes('feature') || description.includes('implement')) {
      requiredAgentTypes.push(AgentType.FULLSTACK);
    }
    if (description.includes('test') || description.includes('testing')) {
      requiredAgentTypes.push(AgentType.TESTER);
    }
    if (description.includes('security') || description.includes('vulnerability')) {
      requiredAgentTypes.push(AgentType.SECURITY);
    }
    if (description.includes('optimize') || description.includes('performance')) {
      requiredAgentTypes.push(AgentType.OPTIMIZATION);
    }
    if (description.includes('document') || description.includes('docs')) {
      requiredAgentTypes.push(AgentType.DOCUMENTATION);
    }

    if (requiredAgentTypes.length === 0) {
      requiredAgentTypes.push(AgentType.FULLSTACK);
    }

    const complexity = requiredAgentTypes.length * 2;

    return {
      requestType: 'feature_implementation',
      complexity,
      requiredAgentTypes,
      keywords: description.split(' ')
    };
  }

  private async decomposeTasks(analysis: {
    requestType: string;
    complexity: number;
    requiredAgentTypes: AgentType[];
    keywords: string[];
  }): Promise<TaskDecomposition> {
    await this.simulateDelay(150);

    const subtasks: SubTask[] = [];
    const dependencies: TaskDependency[] = [];
    let totalDuration = 0;

    analysis.requiredAgentTypes.forEach((agentType, index) => {
      const taskId = `subtask-${index + 1}`;
      const subtask = this.createSubTaskForAgentType(taskId, agentType, analysis.keywords);

      subtasks.push(subtask);
      totalDuration += subtask.estimatedDuration;

      if (index > 0) {
        dependencies.push({
          taskId,
          dependsOn: [`subtask-${index}`]
        });
      }
    });

    return {
      mainTask: `Complete user request with ${analysis.requiredAgentTypes.length} specialized agents`,
      subtasks,
      dependencies,
      estimatedTotalDuration: totalDuration
    };
  }

  private createSubTaskForAgentType(
    taskId: string,
    agentType: AgentType,
    keywords: string[]
  ): SubTask {
    const taskTypeMap: Record<AgentType, TaskType> = {
      [AgentType.DATABASE]: TaskType.DATABASE_OPERATION,
      [AgentType.UI_UX]: TaskType.UI_DESIGN,
      [AgentType.FULLSTACK]: TaskType.CODE_GENERATION,
      [AgentType.TESTER]: TaskType.TESTING,
      [AgentType.SECURITY]: TaskType.SECURITY_AUDIT,
      [AgentType.OPTIMIZATION]: TaskType.OPTIMIZATION,
      [AgentType.DOCUMENTATION]: TaskType.DOCUMENTATION,
      [AgentType.META_PROJECT_MANAGER]: TaskType.CODE_GENERATION
    };

    const titleMap: Record<AgentType, string> = {
      [AgentType.DATABASE]: 'Setup database schema and operations',
      [AgentType.UI_UX]: 'Design and implement UI components',
      [AgentType.FULLSTACK]: 'Implement feature logic and integration',
      [AgentType.TESTER]: 'Create and run comprehensive tests',
      [AgentType.SECURITY]: 'Perform security audit and validation',
      [AgentType.OPTIMIZATION]: 'Optimize performance and resource usage',
      [AgentType.DOCUMENTATION]: 'Generate documentation and guides',
      [AgentType.META_PROJECT_MANAGER]: 'Coordinate project execution'
    };

    return {
      id: taskId,
      title: titleMap[agentType],
      description: `Execute ${agentType} tasks for: ${keywords.join(' ')}`,
      type: taskTypeMap[agentType],
      priority: TaskPriority.MEDIUM,
      assignedAgentType: agentType,
      estimatedDuration: 5000,
      dependencies: []
    };
  }

  private async createExecutionPlan(decomposition: TaskDecomposition): Promise<ExecutionPlan> {
    await this.simulateDelay(100);

    const tasks: AgentTask[] = decomposition.subtasks.map(subtask => {
      const taskDto: AgentTaskCreateDto = {
        title: subtask.title,
        description: subtask.description,
        type: subtask.type,
        priority: subtask.priority,
        estimatedDuration: subtask.estimatedDuration,
        dependencies: subtask.dependencies,
        metadata: {
          assignedAgentType: subtask.assignedAgentType
        }
      };

      return this.taskQueue.enqueue(taskDto);
    });

    const executionOrder = this.determineExecutionOrder(tasks, decomposition.dependencies);

    return {
      tasks,
      executionOrder,
      estimatedDuration: decomposition.estimatedTotalDuration
    };
  }

  private determineExecutionOrder(
    tasks: AgentTask[],
    dependencies: TaskDependency[]
  ): string[][] {
    const levels: string[][] = [];
    const processed = new Set<string>();

    while (processed.size < tasks.length) {
      const currentLevel: string[] = [];

      for (const task of tasks) {
        if (processed.has(task.id)) {
          continue;
        }

        const dep = dependencies.find(d => d.taskId === task.id);
        const canExecute = !dep || dep.dependsOn.every(depId => processed.has(depId));

        if (canExecute) {
          currentLevel.push(task.id);
        }
      }

      if (currentLevel.length === 0 && processed.size < tasks.length) {
        const remaining = tasks.filter(t => !processed.has(t.id));
        currentLevel.push(...remaining.map(t => t.id));
      }

      currentLevel.forEach(id => processed.add(id));
      levels.push(currentLevel);
    }

    return levels;
  }

  private async assignAgents(executionPlan: ExecutionPlan): Promise<Map<string, string>> {
    const assignments = new Map<string, string>();

    for (const task of executionPlan.tasks) {
      const agent = this.registry.findBestAgentForTask(task.type);

      if (agent) {
        this.taskQueue.assignTask(task.id, agent.id);
        assignments.set(task.id, agent.id);

        this.logger.info(
          this.META_AGENT_ID,
          LogCategory.TASK_EXECUTION,
          `Assigned task ${task.id} to agent ${agent.id}`,
          { taskTitle: task.title, agentType: agent.type }
        );
      } else {
        this.logger.warn(
          this.META_AGENT_ID,
          LogCategory.TASK_EXECUTION,
          `No agent available for task ${task.id}`,
          { taskType: task.type }
        );
      }
    }

    return assignments;
  }

  private async executeWithCoordination(
    requestId: string,
    executionPlan: ExecutionPlan
  ): Promise<void> {
    for (const level of executionPlan.executionOrder) {
      const levelPromises = level.map(taskId => this.executeTask(taskId));
      await Promise.all(levelPromises);
    }
  }

  private async executeTask(taskId: string): Promise<void> {
    const task = this.taskQueue.getTaskById(taskId);

    if (!task || !task.assignedTo) {
      throw new Error(`Task ${taskId} not found or not assigned`);
    }

    this.registry.updateAgentStatus(task.assignedTo, AgentStatus.WORKING);
    this.taskQueue.startTask(taskId);

    this.logger.info(
      this.META_AGENT_ID,
      LogCategory.TASK_EXECUTION,
      `Starting task execution`,
      { taskId, agentId: task.assignedTo }
    );

    try {
      await this.simulateTaskExecution(task);

      this.taskQueue.completeTask(taskId, { success: true });
      this.registry.updateAgentStatus(task.assignedTo, AgentStatus.IDLE);

      this.logger.info(
        this.META_AGENT_ID,
        LogCategory.TASK_EXECUTION,
        `Task completed successfully`,
        { taskId }
      );
    } catch (error) {
      this.taskQueue.failTask(taskId, { message: String(error) });
      this.registry.updateAgentStatus(task.assignedTo, AgentStatus.ERROR);

      this.logger.error(
        this.META_AGENT_ID,
        LogCategory.TASK_EXECUTION,
        `Task execution failed`,
        { taskId, error }
      );

      throw error;
    }
  }

  private async simulateTaskExecution(task: AgentTask): Promise<void> {
    const duration = task.estimatedDuration || 3000;
    await this.simulateDelay(duration);
  }

  private async consolidateResults(requestId: string): Promise<any> {
    const execution = this.activeExecutionsState().get(requestId);

    if (!execution) {
      throw new Error(`Execution ${requestId} not found`);
    }

    const results = execution.tasks.map(task => ({
      taskId: task.id,
      title: task.title,
      status: task.status,
      result: task.result
    }));

    this.activeExecutionsState.update(map => {
      const newMap = new Map(map);
      newMap.delete(requestId);
      return newMap;
    });

    this.executionHistoryState.update(history =>
      history.map(h =>
        h.requestId === requestId
          ? { ...h, status: 'completed', completedAt: new Date() }
          : h
      )
    );

    return {
      requestId,
      status: 'completed',
      tasks: results,
      completedAt: new Date()
    };
  }

  getExecutionStatus(requestId: string) {
    const execution = this.executionHistoryState().find(h => h.requestId === requestId);
    return execution || null;
  }

  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
