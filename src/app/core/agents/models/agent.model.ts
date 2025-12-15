import { AgentTask } from './agent-task.model';
import { Skill, Tool, AgentContext, AgentConstraints } from './agent-capability.model';

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  status: AgentStatus;
  skills: Skill[];
  tools: Tool[];
  context: AgentContext;
  constraints: AgentConstraints;
  currentTask?: AgentTask;
  tasksCompleted: number;
  tasksInQueue: number;
  successRate: number;
  createdAt: Date;
  lastActiveAt?: Date;
}

export enum AgentType {
  META_PROJECT_MANAGER = 'meta_project_manager',
  DATABASE = 'database',
  UI_UX = 'ui_ux',
  DOCUMENTATION = 'documentation',
  FULLSTACK = 'fullstack',
  TESTER = 'tester',
  SECURITY = 'security',
  OPTIMIZATION = 'optimization'
}

export enum AgentStatus {
  IDLE = 'idle',
  WORKING = 'working',
  WAITING = 'waiting',
  ERROR = 'error',
  PAUSED = 'paused',
  OFFLINE = 'offline'
}

export interface AgentCreateDto {
  type: AgentType;
  name: string;
  description: string;
}

export interface AgentUpdateDto {
  id: string;
  status?: AgentStatus;
  currentTask?: AgentTask;
  tasksCompleted?: number;
  tasksInQueue?: number;
  successRate?: number;
  lastActiveAt?: Date;
}

export interface AgentMetrics {
  agentId: string;
  agentName: string;
  agentType: AgentType;
  totalTasksCompleted: number;
  totalTasksFailed: number;
  averageExecutionTime: number;
  successRate: number;
  currentStatus: AgentStatus;
  uptime: number;
  lastError?: string;
}
