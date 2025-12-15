import { Agent, AgentType, AgentStatus } from '../../models/agent.model';
import { databaseSkills } from './database.skills';
import { createDatabaseTools } from './database.tools';
import { databaseContext } from './database.context';
import { databaseConstraints } from './database.constraints';

export const createDatabaseAgent = (): Agent => {
  return {
    id: 'agent-database-001',
    type: AgentType.DATABASE,
    name: 'Database Agent',
    description: 'Specialized agent for database operations, data modeling, CRUD operations, and JSON schema management. Handles all data persistence and retrieval operations with validation and optimization.',
    status: AgentStatus.IDLE,
    skills: databaseSkills,
    tools: createDatabaseTools(),
    context: databaseContext,
    constraints: databaseConstraints,
    tasksCompleted: 0,
    tasksInQueue: 0,
    successRate: 100,
    createdAt: new Date(),
    lastActiveAt: undefined
  };
};

export class DatabaseAgentExecutor {
  private agent: Agent;

  constructor() {
    this.agent = createDatabaseAgent();
  }

  getAgent(): Agent {
    return this.agent;
  }

  async executeTask(taskDescription: string, params: any): Promise<any> {
    const toolName = this.determineToolFromTask(taskDescription);
    const tool = this.agent.tools.find(t => t.name === toolName);

    if (!tool) {
      throw new Error(`No tool found for task: ${taskDescription}`);
    }

    const validation = tool.validate ? tool.validate(params) : { valid: true };

    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors?.join(', ')}`);
    }

    return await tool.execute(params);
  }

  private determineToolFromTask(taskDescription: string): string {
    const description = taskDescription.toLowerCase();

    if (description.includes('create') || description.includes('add') || description.includes('insert')) {
      return 'createEntity';
    }

    if (description.includes('update') || description.includes('modify') || description.includes('change')) {
      return 'updateEntity';
    }

    if (description.includes('delete') || description.includes('remove')) {
      return 'deleteEntity';
    }

    if (description.includes('query') || description.includes('search') || description.includes('find')) {
      return 'queryData';
    }

    if (description.includes('validate') || description.includes('check schema')) {
      return 'validateSchema';
    }

    if (description.includes('migrate')) {
      return 'migrateData';
    }

    if (description.includes('backup')) {
      return 'backupData';
    }

    return 'queryData';
  }

  getSkills() {
    return this.agent.skills;
  }

  getTools() {
    return this.agent.tools;
  }

  getContext() {
    return this.agent.context;
  }

  getConstraints() {
    return this.agent.constraints;
  }

  canExecuteOperation(operation: string): boolean {
    return this.agent.constraints.allowedOperations.includes(operation) &&
           !this.agent.constraints.forbiddenOperations.includes(operation);
  }

  requiresApproval(operation: string): boolean {
    return this.agent.constraints.requiresApproval.includes(operation);
  }
}
