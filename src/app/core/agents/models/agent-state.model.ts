import { AgentTask } from './agent-task.model';
import { AgentMessage } from './agent-message.model';

export interface AgentState {
  agentId: string;
  currentStatus: string;
  currentTask?: AgentTask;
  taskQueue: AgentTask[];
  messageQueue: AgentMessage[];
  workload: number;
  memoryUsage: number;
  cpuUsage: number;
  lastHeartbeat: Date;
  healthStatus: HealthStatus;
  performance: PerformanceMetrics;
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}

export interface PerformanceMetrics {
  tasksPerHour: number;
  averageTaskDuration: number;
  successRate: number;
  errorRate: number;
  responseTime: number;
  throughput: number;
  uptime: number;
}

export interface AgentWorkloadMetrics {
  agentId: string;
  currentLoad: number;
  averageLoad: number;
  peakLoad: number;
  tasksPending: number;
  tasksInProgress: number;
  tasksCompleted: number;
  tasksFailed: number;
  estimatedCapacity: number;
  utilizationPercentage: number;
}

export interface AgentStatistics {
  agentId: string;
  totalTasksReceived: number;
  totalTasksCompleted: number;
  totalTasksFailed: number;
  totalTasksCancelled: number;
  totalExecutionTime: number;
  averageExecutionTime: number;
  fastestExecution: number;
  slowestExecution: number;
  successRate: number;
  uptime: number;
  totalDowntime: number;
  lastErrorTimestamp?: Date;
  lastErrorMessage?: string;
}

export interface AgentEvent {
  id: string;
  agentId: string;
  eventType: AgentEventType;
  severity: EventSeverity;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  acknowledged: boolean;
}

export enum AgentEventType {
  STARTED = 'started',
  STOPPED = 'stopped',
  PAUSED = 'paused',
  RESUMED = 'resumed',
  ERROR = 'error',
  WARNING = 'warning',
  TASK_STARTED = 'task_started',
  TASK_COMPLETED = 'task_completed',
  TASK_FAILED = 'task_failed',
  RESOURCE_LIMIT_REACHED = 'resource_limit_reached',
  HEALTH_CHECK_FAILED = 'health_check_failed',
  CONFIGURATION_CHANGED = 'configuration_changed'
}

export enum EventSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface AgentSnapshot {
  agentId: string;
  timestamp: Date;
  state: AgentState;
  statistics: AgentStatistics;
  workload: AgentWorkloadMetrics;
  recentEvents: AgentEvent[];
}
