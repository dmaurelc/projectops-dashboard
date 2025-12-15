export interface AgentTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  dependencies: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  result?: TaskResult;
  error?: TaskError;
  metadata: Record<string, any>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  updatedAt: Date;
}

export enum TaskType {
  DATABASE_OPERATION = 'database_operation',
  UI_DESIGN = 'ui_design',
  CODE_GENERATION = 'code_generation',
  TESTING = 'testing',
  SECURITY_AUDIT = 'security_audit',
  OPTIMIZATION = 'optimization',
  DOCUMENTATION = 'documentation',
  CODE_REVIEW = 'code_review',
  REFACTORING = 'refactoring',
  BUG_FIX = 'bug_fix'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface TaskResult {
  success: boolean;
  data?: any;
  message?: string;
  artifacts?: TaskArtifact[];
  metrics?: TaskMetrics;
}

export interface TaskArtifact {
  type: 'file' | 'code' | 'documentation' | 'test' | 'report';
  path?: string;
  content?: string;
  description: string;
  createdAt: Date;
}

export interface TaskError {
  code: string;
  message: string;
  stack?: string;
  timestamp: Date;
  recoverable: boolean;
}

export interface TaskMetrics {
  executionTime: number;
  complexity: number;
  linesOfCode?: number;
  testsCoverage?: number;
  performanceImpact?: number;
}

export interface AgentTaskCreateDto {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  assignedTo?: string;
  dependencies?: string[];
  estimatedDuration?: number;
  metadata?: Record<string, any>;
}

export interface AgentTaskUpdateDto {
  id: string;
  status?: TaskStatus;
  assignedTo?: string;
  progress?: number;
  result?: TaskResult;
  error?: TaskError;
  actualDuration?: number;
  startedAt?: Date;
  completedAt?: Date;
}
