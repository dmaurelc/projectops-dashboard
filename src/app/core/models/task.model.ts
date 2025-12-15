import { TaskStatus } from './status.model';

export { TaskStatus };

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedToId?: string;
  dueDate?: Date;
  priority: TaskPriority;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreateDto {
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedToId?: string;
  dueDate?: Date;
  priority: TaskPriority;
  estimatedHours?: number;
  tags?: string[];
}

export interface TaskUpdateDto extends Partial<TaskCreateDto> {
  id: string;
}
