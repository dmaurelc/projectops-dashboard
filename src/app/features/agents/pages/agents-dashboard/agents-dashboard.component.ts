import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentEngineService } from '@core/agents/services/agent-engine.service';
import { AgentRegistryService } from '@core/agents/services/agent-registry.service';
import { TaskQueueService } from '@core/agents/services/task-queue.service';
import { MetaAgentService } from '@core/agents/services/meta-agent.service';
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';
import { AgentStatus } from '@core/agents/models/agent.model';
import { TaskPriority } from '@core/agents/models/agent-task.model';

@Component({
  selector: 'app-agents-dashboard',
  standalone: true,
  imports: [CommonModule, AgentCardComponent],
  template: `
    <div class="agents-dashboard">
      <header class="dashboard-header">
        <h1>AI Agents Dashboard</h1>
        <p class="subtitle">Sistema multi-agente con Project Manager</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalAgents() }}</div>
          <div class="stat-label">Total Agentes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activeAgents() }}</div>
          <div class="stat-label">Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ queueStats().pending }}</div>
          <div class="stat-label">Tareas Pendientes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ queueStats().completed }}</div>
          <div class="stat-label">Tareas Completadas</div>
        </div>
      </div>

      <section class="test-section">
        <h2>Probar Sistema de Agentes</h2>
        <div class="test-controls">
          <button class="btn btn-primary" (click)="testAgentSystem()">
            Ejecutar Tarea de Prueba
          </button>
          <button class="btn btn-secondary" (click)="clearQueue()">
            Limpiar Cola
          </button>
        </div>
        @if (testResult()) {
          <div class="test-result">
            <h3>Resultado:</h3>
            <pre>{{ testResult() }}</pre>
          </div>
        }
      </section>

      <section class="agents-section">
        <h2>Agentes Disponibles</h2>
        <div class="agents-grid">
          @for (agent of agents(); track agent.id) {
            <app-agent-card [agent]="agent" />
          }
        </div>
      </section>

      <section class="tasks-section">
        <h2>Cola de Tareas</h2>
        <div class="tasks-list">
          @if (tasks().length === 0) {
            <p class="empty-state">No hay tareas en cola</p>
          } @else {
            @for (task of tasks(); track task.id) {
              <div class="task-item">
                <div class="task-header">
                  <h4>{{ task.title }}</h4>
                  <span class="task-status" [class]="'status-' + task.status">
                    {{ task.status }}
                  </span>
                </div>
                <p class="task-description">{{ task.description }}</p>
                <div class="task-meta">
                  <span class="task-type">{{ task.type }}</span>
                  <span class="task-priority" [class]="'priority-' + task.priority">
                    {{ task.priority }}
                  </span>
                  @if (task.assignedTo) {
                    <span class="task-agent">Asignado a: {{ getAgentName(task.assignedTo) }}</span>
                  }
                </div>
              </div>
            }
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .agents-dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .test-section {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .test-section h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .test-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .test-result {
      background: #f3f4f6;
      border-radius: 4px;
      padding: 1rem;
    }

    .test-result pre {
      font-family: monospace;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .agents-section, .tasks-section {
      margin-bottom: 2rem;
    }

    .agents-section h2, .tasks-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .agents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .task-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .task-header h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .task-status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-pending { background: #fef3c7; color: #92400e; }
    .status-assigned { background: #dbeafe; color: #1e40af; }
    .status-in_progress { background: #bfdbfe; color: #1e3a8a; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .status-failed { background: #fee2e2; color: #991b1b; }

    .task-description {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
    }

    .task-type {
      padding: 0.25rem 0.5rem;
      background: #f3f4f6;
      border-radius: 4px;
    }

    .task-priority {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .priority-low { background: #f3f4f6; color: #4b5563; }
    .priority-medium { background: #fef3c7; color: #92400e; }
    .priority-high { background: #fed7aa; color: #9a3412; }
    .priority-critical { background: #fecaca; color: #991b1b; }

    .empty-state {
      text-align: center;
      color: #9ca3af;
      padding: 2rem;
    }
  `]
})
export class AgentsDashboardComponent {
  private agentEngine = inject(AgentEngineService);
  private registry = inject(AgentRegistryService);
  private taskQueue = inject(TaskQueueService);
  private metaAgent = inject(MetaAgentService);

  agents = computed(() => this.registry.agents());
  tasks = computed(() => this.taskQueue.tasks());

  totalAgents = computed(() => this.agents().length);
  activeAgents = computed(() =>
    this.agents().filter(a => a.status === AgentStatus.IDLE || a.status === AgentStatus.WORKING).length
  );

  queueStats = computed(() => this.taskQueue.getQueueStatistics());

  testResult = computed(() => '');

  getAgentName(agentId: string): string {
    const agent = this.agents().find(a => a.id === agentId);
    return agent?.name || 'Unknown';
  }

  async testAgentSystem() {
    try {
      console.log('Iniciando prueba del sistema de agentes...');

      const requestId = await this.metaAgent.processUserRequest({
        description: 'Crear una nueva feature de notificaciones con base de datos, UI y tests',
        priority: TaskPriority.HIGH,
        metadata: {}
      });

      console.log('Solicitud procesada:', requestId);
      alert(`Sistema de agentes ejecutado. Request ID: ${requestId}\nRevisa la consola para más detalles.`);
    } catch (error) {
      console.error('Error en prueba:', error);
      alert(`Error: ${error}`);
    }
  }

  clearQueue() {
    this.taskQueue.clearCompletedTasks();
    alert('Cola limpiada');
  }
}
