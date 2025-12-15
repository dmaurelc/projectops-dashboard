export interface AgentMessage {
  id: string;
  from: string;
  to: string | string[];
  type: MessageType;
  priority: MessagePriority;
  subject: string;
  content: any;
  metadata: Record<string, any>;
  timestamp: Date;
  read: boolean;
  requiresResponse: boolean;
  responseTimeout?: number;
  correlationId?: string;
}

export enum MessageType {
  REQUEST = 'request',
  RESPONSE = 'response',
  NOTIFICATION = 'notification',
  BROADCAST = 'broadcast',
  ERROR = 'error',
  STATUS_UPDATE = 'status_update',
  TASK_ASSIGNMENT = 'task_assignment',
  TASK_COMPLETION = 'task_completion',
  COLLABORATION_REQUEST = 'collaboration_request'
}

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface AgentMessageCreateDto {
  from: string;
  to: string | string[];
  type: MessageType;
  priority: MessagePriority;
  subject: string;
  content: any;
  requiresResponse?: boolean;
  responseTimeout?: number;
  metadata?: Record<string, any>;
}

export interface AgentCommunicationLog {
  id: string;
  agentId: string;
  action: CommunicationAction;
  messageId?: string;
  details: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export enum CommunicationAction {
  MESSAGE_SENT = 'message_sent',
  MESSAGE_RECEIVED = 'message_received',
  MESSAGE_READ = 'message_read',
  RESPONSE_SENT = 'response_sent',
  BROADCAST_SENT = 'broadcast_sent',
  ERROR_REPORTED = 'error_reported',
  COLLABORATION_STARTED = 'collaboration_started',
  COLLABORATION_ENDED = 'collaboration_ended'
}

export interface AgentCollaboration {
  id: string;
  participants: string[];
  initiator: string;
  purpose: string;
  status: CollaborationStatus;
  sharedContext: Record<string, any>;
  messages: AgentMessage[];
  startedAt: Date;
  endedAt?: Date;
}

export enum CollaborationStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}
