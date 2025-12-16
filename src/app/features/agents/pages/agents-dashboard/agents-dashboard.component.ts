import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    <div class="p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight">AI Agents Dashboard</h1>
        <p class="text-muted-foreground mt-2">Sistema multi-agente con Project Manager</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="rounded-lg border bg-card p-6">
          <div class="text-2xl font-semibold">{{ totalAgents() }}</div>
          <div class="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Agentes</div>
        </div>
        <div class="rounded-lg border bg-card p-6">
          <div class="text-2xl font-semibold">{{ activeAgents() }}</div>
          <div class="text-xs text-muted-foreground uppercase tracking-wider mt-1">Activos</div>
        </div>
        <div class="rounded-lg border bg-card p-6">
          <div class="text-2xl font-semibold">{{ queueStats().pending }}</div>
          <div class="text-xs text-muted-foreground uppercase tracking-wider mt-1">Tareas Pendientes</div>
        </div>
        <div class="rounded-lg border bg-card p-6">
          <div class="text-2xl font-semibold">{{ queueStats().completed }}</div>
          <div class="text-xs text-muted-foreground uppercase tracking-wider mt-1">Tareas Completadas</div>
        </div>
      </div>

      <!-- Test Section -->
      <div class="rounded-lg border bg-card p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Probar Sistema de Agentes</h2>
        <div class="flex gap-3 mb-4">
          <button
            (click)="testAgentSystem()"
            class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Ejecutar Tarea de Prueba
          </button>
          <button
            (click)="clearQueue()"
            class="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground h-10 px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Limpiar Cola
          </button>
        </div>
        @if (testResult()) {
          <div class="rounded-md bg-muted p-4">
            <h3 class="text-sm font-medium mb-2">Resultado:</h3>
            <pre class="text-xs overflow-auto">{{ testResult() }}</pre>
          </div>
        }
      </div>

      <!-- Agents Section -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Agentes Disponibles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (agent of agents(); track agent.id) {
            <app-agent-card [agent]="agent" />
          }
        </div>
      </div>

      <!-- Tasks Section -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Cola de Tareas</h2>
        <div class="space-y-3">
          @if (tasks().length === 0) {
            <p class="text-center text-muted-foreground py-8">No hay tareas en cola</p>
          } @else {
            @for (task of tasks(); track task.id) {
              <div class="rounded-lg border bg-card p-4">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium">{{ task.title }}</h4>
                  <span
                    class="inline-flex h-6 items-center gap-1.5 rounded-md border border-input bg-background px-2 text-xs font-medium"
                    [class.text-amber-600]="task.status === 'pending'"
                    [class.text-blue-600]="task.status === 'assigned' || task.status === 'in_progress'"
                    [class.text-green-600]="task.status === 'completed'"
                    [class.text-red-600]="task.status === 'failed'"
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      [class.bg-amber-600]="task.status === 'pending'"
                      [class.bg-blue-600]="task.status === 'assigned' || task.status === 'in_progress'"
                      [class.bg-green-600]="task.status === 'completed'"
                      [class.bg-red-600]="task.status === 'failed'"
                    ></span>
                    {{ task.status }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground mb-3">{{ task.description }}</p>
                <div class="flex items-center gap-3 text-xs">
                  <span class="inline-flex items-center rounded-md bg-secondary px-2 py-1">{{ task.type }}</span>
                  <span
                    class="inline-flex items-center rounded-md px-2 py-1"
                    [class.bg-muted]="task.priority === 'low'"
                    [class.bg-amber-100]="task.priority === 'medium'"
                    [class.bg-orange-100]="task.priority === 'high'"
                    [class.bg-red-100]="task.priority === 'critical'"
                    [class.text-amber-800]="task.priority === 'medium'"
                    [class.text-orange-800]="task.priority === 'high'"
                    [class.text-red-800]="task.priority === 'critical'"
                  >
                    {{ task.priority }}
                  </span>
                  @if (task.assignedTo) {
                    <span class="text-muted-foreground">Asignado a: {{ getAgentName(task.assignedTo) }}</span>
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AgentsDashboardComponent {
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
