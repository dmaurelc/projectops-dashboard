import { Injectable, signal, computed } from '@angular/core';
import {
  AgentMessage,
  AgentMessageCreateDto,
  MessageType,
  MessagePriority,
  AgentCommunicationLog,
  CommunicationAction,
  AgentCollaboration,
  CollaborationStatus
} from '../models/agent-message.model';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AgentCommunicationService {
  private messagesState = signal<AgentMessage[]>([]);
  private collaborationsState = signal<AgentCollaboration[]>([]);
  private communicationLogsState = signal<AgentCommunicationLog[]>([]);
  private messageIdCounter = signal<number>(1);

  private messageSubject = new Subject<AgentMessage>();
  private broadcastSubject = new Subject<AgentMessage>();

  readonly messages = this.messagesState.asReadonly();
  readonly collaborations = this.collaborationsState.asReadonly();
  readonly communicationLogs = this.communicationLogsState.asReadonly();

  readonly unreadMessages = computed(() =>
    this.messagesState().filter(msg => !msg.read)
  );

  readonly messagesByAgent = computed(() => {
    const map = new Map<string, AgentMessage[]>();
    this.messagesState().forEach(msg => {
      const messages = map.get(msg.to as string) || [];
      messages.push(msg);
      map.set(msg.to as string, messages);
    });
    return map;
  });

  sendMessage(messageDto: AgentMessageCreateDto): AgentMessage {
    const now = new Date();
    const message: AgentMessage = {
      id: this.generateMessageId(),
      from: messageDto.from,
      to: messageDto.to,
      type: messageDto.type,
      priority: messageDto.priority,
      subject: messageDto.subject,
      content: messageDto.content,
      metadata: messageDto.metadata || {},
      timestamp: now,
      read: false,
      requiresResponse: messageDto.requiresResponse || false,
      responseTimeout: messageDto.responseTimeout
    };

    this.messagesState.update(messages => [...messages, message]);

    this.logCommunication({
      agentId: message.from,
      action: CommunicationAction.MESSAGE_SENT,
      messageId: message.id,
      details: `Sent message to ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`,
      timestamp: now
    });

    if (message.type === MessageType.BROADCAST) {
      this.broadcastSubject.next(message);
      this.logCommunication({
        agentId: message.from,
        action: CommunicationAction.BROADCAST_SENT,
        messageId: message.id,
        details: `Broadcast message: ${message.subject}`,
        timestamp: now
      });
    } else {
      this.messageSubject.next(message);
    }

    return message;
  }

  getMessagesForAgent(agentId: string): AgentMessage[] {
    return this.messagesState().filter(msg => {
      if (Array.isArray(msg.to)) {
        return msg.to.includes(agentId);
      }
      return msg.to === agentId;
    });
  }

  getUnreadMessagesForAgent(agentId: string): AgentMessage[] {
    return this.getMessagesForAgent(agentId).filter(msg => !msg.read);
  }

  markMessageAsRead(messageId: string, agentId: string): void {
    this.messagesState.update(messages =>
      messages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );

    this.logCommunication({
      agentId,
      action: CommunicationAction.MESSAGE_READ,
      messageId,
      details: 'Message marked as read',
      timestamp: new Date()
    });
  }

  respondToMessage(originalMessageId: string, response: AgentMessageCreateDto): AgentMessage {
    const originalMessage = this.messagesState().find(msg => msg.id === originalMessageId);

    const responseMessage = this.sendMessage({
      ...response,
      type: MessageType.RESPONSE,
      metadata: {
        ...response.metadata,
        originalMessageId,
        correlationId: originalMessage?.correlationId || originalMessageId
      }
    });

    this.logCommunication({
      agentId: response.from,
      action: CommunicationAction.RESPONSE_SENT,
      messageId: responseMessage.id,
      details: `Response to message ${originalMessageId}`,
      timestamp: new Date()
    });

    return responseMessage;
  }

  broadcast(from: string, subject: string, content: any, metadata?: Record<string, any>): AgentMessage {
    return this.sendMessage({
      from,
      to: 'all',
      type: MessageType.BROADCAST,
      priority: MessagePriority.NORMAL,
      subject,
      content,
      metadata
    });
  }

  observeMessagesForAgent(agentId: string): Observable<AgentMessage> {
    return this.messageSubject.asObservable().pipe(
      filter(msg => {
        if (Array.isArray(msg.to)) {
          return msg.to.includes(agentId);
        }
        return msg.to === agentId;
      })
    );
  }

  observeBroadcasts(): Observable<AgentMessage> {
    return this.broadcastSubject.asObservable();
  }

  startCollaboration(initiatorId: string, participantIds: string[], purpose: string): AgentCollaboration {
    const now = new Date();
    const collaboration: AgentCollaboration = {
      id: this.generateCollaborationId(),
      participants: [initiatorId, ...participantIds],
      initiator: initiatorId,
      purpose,
      status: CollaborationStatus.ACTIVE,
      sharedContext: {},
      messages: [],
      startedAt: now
    };

    this.collaborationsState.update(colabs => [...colabs, collaboration]);

    this.logCommunication({
      agentId: initiatorId,
      action: CommunicationAction.COLLABORATION_STARTED,
      details: `Started collaboration with ${participantIds.join(', ')} for: ${purpose}`,
      timestamp: now
    });

    participantIds.forEach(participantId => {
      this.sendMessage({
        from: initiatorId,
        to: participantId,
        type: MessageType.COLLABORATION_REQUEST,
        priority: MessagePriority.HIGH,
        subject: `Collaboration Request: ${purpose}`,
        content: {
          collaborationId: collaboration.id,
          purpose
        },
        requiresResponse: true
      });
    });

    return collaboration;
  }

  endCollaboration(collaborationId: string, initiatorId: string): boolean {
    const collaboration = this.collaborationsState().find(c => c.id === collaborationId);

    if (!collaboration || collaboration.initiator !== initiatorId) {
      return false;
    }

    this.collaborationsState.update(colabs =>
      colabs.map(c =>
        c.id === collaborationId
          ? { ...c, status: CollaborationStatus.COMPLETED, endedAt: new Date() }
          : c
      )
    );

    this.logCommunication({
      agentId: initiatorId,
      action: CommunicationAction.COLLABORATION_ENDED,
      details: `Ended collaboration ${collaborationId}`,
      timestamp: new Date()
    });

    return true;
  }

  addMessageToCollaboration(collaborationId: string, message: AgentMessage): void {
    this.collaborationsState.update(colabs =>
      colabs.map(c =>
        c.id === collaborationId
          ? { ...c, messages: [...c.messages, message] }
          : c
      )
    );
  }

  updateCollaborationContext(collaborationId: string, context: Record<string, any>): void {
    this.collaborationsState.update(colabs =>
      colabs.map(c =>
        c.id === collaborationId
          ? { ...c, sharedContext: { ...c.sharedContext, ...context } }
          : c
      )
    );
  }

  getCollaboration(collaborationId: string): AgentCollaboration | undefined {
    return this.collaborationsState().find(c => c.id === collaborationId);
  }

  getActiveCollaborationsForAgent(agentId: string): AgentCollaboration[] {
    return this.collaborationsState().filter(c =>
      c.status === CollaborationStatus.ACTIVE &&
      c.participants.includes(agentId)
    );
  }

  private logCommunication(log: Omit<AgentCommunicationLog, 'id'>): void {
    const communicationLog: AgentCommunicationLog = {
      id: this.generateLogId(),
      ...log
    };

    this.communicationLogsState.update(logs => [...logs, communicationLog]);
  }

  getCommunicationLogs(agentId?: string, limit: number = 100): AgentCommunicationLog[] {
    let logs = this.communicationLogsState();

    if (agentId) {
      logs = logs.filter(log => log.agentId === agentId);
    }

    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  clearOldMessages(olderThanMs: number = 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - olderThanMs;

    this.messagesState.update(messages =>
      messages.filter(msg => msg.timestamp.getTime() > cutoffTime)
    );
  }

  clearOldLogs(olderThanMs: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - olderThanMs;

    this.communicationLogsState.update(logs =>
      logs.filter(log => log.timestamp.getTime() > cutoffTime)
    );
  }

  private generateMessageId(): string {
    const id = this.messageIdCounter();
    this.messageIdCounter.update(counter => counter + 1);
    return `msg-${id}-${Date.now()}`;
  }

  private generateCollaborationId(): string {
    return `collab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateLogId(): string {
    return `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
