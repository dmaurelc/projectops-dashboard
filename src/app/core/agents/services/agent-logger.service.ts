import { Injectable, signal, computed } from '@angular/core';
import { AgentEvent, AgentEventType, EventSeverity } from '../models/agent-state.model';

export interface LogEntry {
  id: string;
  timestamp: Date;
  agentId: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: any;
  correlationId?: string;
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export enum LogCategory {
  AGENT_LIFECYCLE = 'agent_lifecycle',
  TASK_EXECUTION = 'task_execution',
  COMMUNICATION = 'communication',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  DATA_OPERATION = 'data_operation',
  SYSTEM = 'system'
}

@Injectable({
  providedIn: 'root'
})
export class AgentLoggerService {
  private logsState = signal<LogEntry[]>([]);
  private eventsState = signal<AgentEvent[]>([]);
  private logIdCounter = signal<number>(1);
  private eventIdCounter = signal<number>(1);

  readonly logs = this.logsState.asReadonly();
  readonly events = this.eventsState.asReadonly();

  readonly errorLogs = computed(() =>
    this.logsState().filter(log =>
      log.level === LogLevel.ERROR || log.level === LogLevel.FATAL
    )
  );

  readonly warningLogs = computed(() =>
    this.logsState().filter(log => log.level === LogLevel.WARN)
  );

  readonly recentLogs = computed(() =>
    this.logsState().slice(-100)
  );

  readonly logsByAgent = computed(() => {
    const map = new Map<string, LogEntry[]>();
    this.logsState().forEach(log => {
      const logs = map.get(log.agentId) || [];
      logs.push(log);
      map.set(log.agentId, logs);
    });
    return map;
  });

  readonly eventsByAgent = computed(() => {
    const map = new Map<string, AgentEvent[]>();
    this.eventsState().forEach(event => {
      const events = map.get(event.agentId) || [];
      events.push(event);
      map.set(event.agentId, events);
    });
    return map;
  });

  debug(agentId: string, category: LogCategory, message: string, details?: any): void {
    this.log(agentId, LogLevel.DEBUG, category, message, details);
  }

  info(agentId: string, category: LogCategory, message: string, details?: any): void {
    this.log(agentId, LogLevel.INFO, category, message, details);
  }

  warn(agentId: string, category: LogCategory, message: string, details?: any): void {
    this.log(agentId, LogLevel.WARN, category, message, details);
  }

  error(agentId: string, category: LogCategory, message: string, details?: any): void {
    this.log(agentId, LogLevel.ERROR, category, message, details);
  }

  fatal(agentId: string, category: LogCategory, message: string, details?: any): void {
    this.log(agentId, LogLevel.FATAL, category, message, details);
  }

  private log(
    agentId: string,
    level: LogLevel,
    category: LogCategory,
    message: string,
    details?: any,
    correlationId?: string
  ): void {
    const logEntry: LogEntry = {
      id: this.generateLogId(),
      timestamp: new Date(),
      agentId,
      level,
      category,
      message,
      details,
      correlationId
    };

    this.logsState.update(logs => [...logs, logEntry]);

    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      this.logEvent(agentId, AgentEventType.ERROR, EventSeverity.ERROR, message, details);
    } else if (level === LogLevel.WARN) {
      this.logEvent(agentId, AgentEventType.WARNING, EventSeverity.WARNING, message, details);
    }

    if (this.shouldPrintToConsole(level)) {
      this.printToConsole(logEntry);
    }
  }

  logEvent(
    agentId: string,
    eventType: AgentEventType,
    severity: EventSeverity,
    message: string,
    details?: Record<string, any>
  ): void {
    const event: AgentEvent = {
      id: this.generateEventId(),
      agentId,
      eventType,
      severity,
      message,
      details,
      timestamp: new Date(),
      acknowledged: false
    };

    this.eventsState.update(events => [...events, event]);

    const logLevel = this.severityToLogLevel(severity);
    const category = this.eventTypeToCategory(eventType);

    this.log(agentId, logLevel, category, message, details);
  }

  acknowledgeEvent(eventId: string): void {
    this.eventsState.update(events =>
      events.map(event =>
        event.id === eventId ? { ...event, acknowledged: true } : event
      )
    );
  }

  getLogsForAgent(agentId: string, limit: number = 100): LogEntry[] {
    return this.logsState()
      .filter(log => log.agentId === agentId)
      .slice(-limit);
  }

  getEventsForAgent(agentId: string, limit: number = 50): AgentEvent[] {
    return this.eventsState()
      .filter(event => event.agentId === agentId)
      .slice(-limit);
  }

  getLogsByLevel(level: LogLevel, limit: number = 100): LogEntry[] {
    return this.logsState()
      .filter(log => log.level === level)
      .slice(-limit);
  }

  getLogsByCategory(category: LogCategory, limit: number = 100): LogEntry[] {
    return this.logsState()
      .filter(log => log.category === category)
      .slice(-limit);
  }

  getLogsByTimeRange(startDate: Date, endDate: Date): LogEntry[] {
    return this.logsState().filter(log =>
      log.timestamp >= startDate && log.timestamp <= endDate
    );
  }

  getEventsBySeverity(severity: EventSeverity): AgentEvent[] {
    return this.eventsState().filter(event => event.severity === severity);
  }

  getUnacknowledgedEvents(): AgentEvent[] {
    return this.eventsState().filter(event => !event.acknowledged);
  }

  searchLogs(query: string): LogEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.logsState().filter(log =>
      log.message.toLowerCase().includes(lowerQuery) ||
      log.agentId.toLowerCase().includes(lowerQuery) ||
      JSON.stringify(log.details).toLowerCase().includes(lowerQuery)
    );
  }

  exportLogs(agentId?: string): string {
    const logsToExport = agentId
      ? this.getLogsForAgent(agentId, Infinity)
      : this.logsState();

    return JSON.stringify(logsToExport, null, 2);
  }

  clearLogs(olderThanMs?: number): void {
    if (olderThanMs) {
      const cutoffTime = Date.now() - olderThanMs;
      this.logsState.update(logs =>
        logs.filter(log => log.timestamp.getTime() > cutoffTime)
      );
      this.eventsState.update(events =>
        events.filter(event => event.timestamp.getTime() > cutoffTime)
      );
    } else {
      this.logsState.set([]);
      this.eventsState.set([]);
      this.logIdCounter.set(1);
      this.eventIdCounter.set(1);
    }
  }

  getLogStatistics() {
    const logs = this.logsState();
    const events = this.eventsState();

    return {
      totalLogs: logs.length,
      totalEvents: events.length,
      logsByLevel: {
        debug: logs.filter(l => l.level === LogLevel.DEBUG).length,
        info: logs.filter(l => l.level === LogLevel.INFO).length,
        warn: logs.filter(l => l.level === LogLevel.WARN).length,
        error: logs.filter(l => l.level === LogLevel.ERROR).length,
        fatal: logs.filter(l => l.level === LogLevel.FATAL).length
      },
      eventsBySeverity: {
        info: events.filter(e => e.severity === EventSeverity.INFO).length,
        warning: events.filter(e => e.severity === EventSeverity.WARNING).length,
        error: events.filter(e => e.severity === EventSeverity.ERROR).length,
        critical: events.filter(e => e.severity === EventSeverity.CRITICAL).length
      },
      unacknowledgedEvents: this.getUnacknowledgedEvents().length,
      oldestLogTimestamp: logs[0]?.timestamp,
      newestLogTimestamp: logs[logs.length - 1]?.timestamp
    };
  }

  private severityToLogLevel(severity: EventSeverity): LogLevel {
    switch (severity) {
      case EventSeverity.INFO:
        return LogLevel.INFO;
      case EventSeverity.WARNING:
        return LogLevel.WARN;
      case EventSeverity.ERROR:
        return LogLevel.ERROR;
      case EventSeverity.CRITICAL:
        return LogLevel.FATAL;
      default:
        return LogLevel.INFO;
    }
  }

  private eventTypeToCategory(eventType: AgentEventType): LogCategory {
    switch (eventType) {
      case AgentEventType.STARTED:
      case AgentEventType.STOPPED:
      case AgentEventType.PAUSED:
      case AgentEventType.RESUMED:
        return LogCategory.AGENT_LIFECYCLE;
      case AgentEventType.TASK_STARTED:
      case AgentEventType.TASK_COMPLETED:
      case AgentEventType.TASK_FAILED:
        return LogCategory.TASK_EXECUTION;
      case AgentEventType.RESOURCE_LIMIT_REACHED:
      case AgentEventType.HEALTH_CHECK_FAILED:
        return LogCategory.PERFORMANCE;
      case AgentEventType.CONFIGURATION_CHANGED:
        return LogCategory.SYSTEM;
      default:
        return LogCategory.SYSTEM;
    }
  }

  private shouldPrintToConsole(level: LogLevel): boolean {
    return level !== LogLevel.DEBUG;
  }

  private printToConsole(log: LogEntry): void {
    const timestamp = log.timestamp.toISOString();
    const prefix = `[${timestamp}] [${log.agentId}] [${log.level.toUpperCase()}] [${log.category}]`;

    switch (log.level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${log.message}`, log.details);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${log.message}`, log.details);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${log.message}`, log.details);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(`${prefix} ${log.message}`, log.details);
        break;
    }
  }

  private generateLogId(): string {
    const id = this.logIdCounter();
    this.logIdCounter.update(counter => counter + 1);
    return `log-${id}`;
  }

  private generateEventId(): string {
    const id = this.eventIdCounter();
    this.eventIdCounter.update(counter => counter + 1);
    return `event-${id}`;
  }
}
