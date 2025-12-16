import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent } from '@core/agents/models/agent.model';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-lg border bg-card text-card-foreground transition-colors hover:bg-accent/50">
      <!-- Header -->
      <div class="flex flex-col space-y-1.5 p-6">
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl flex-shrink-0">
            {{ getAgentIcon() }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold leading-none tracking-tight">
              {{ agent().name }}
            </h3>
            <p class="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              {{ formatType() }}
            </p>
          </div>

          <!-- Status -->
          <span
            class="inline-flex h-6 items-center gap-1.5 rounded-md border border-input bg-background px-2 text-xs font-medium"
            [class.text-green-600]="agent().status === 'idle'"
            [class.text-blue-600]="agent().status === 'working'"
            [class.text-amber-600]="agent().status === 'waiting'"
            [class.text-red-600]="agent().status === 'error'"
          >
            <span
              class="h-1.5 w-1.5 rounded-full"
              [class.bg-green-600]="agent().status === 'idle'"
              [class.bg-blue-600]="agent().status === 'working'"
              [class.bg-amber-600]="agent().status === 'waiting'"
              [class.bg-red-600]="agent().status === 'error'"
            ></span>
            {{ agent().status }}
          </span>
        </div>

        <!-- Description -->
        <p class="text-sm text-muted-foreground pt-2">
          {{ agent().description }}
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 px-6 pb-4 border-b">
        <div class="text-center">
          <div class="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Skills</div>
          <div class="text-xl font-semibold">{{ agent().skills.length }}</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Success</div>
          <div class="text-xl font-semibold">{{ agent().successRate }}%</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Tasks</div>
          <div class="text-xl font-semibold">{{ agent().tasksCompleted }}</div>
        </div>
      </div>

      <!-- Skills -->
      <div class="flex flex-wrap gap-1.5 p-6">
        @for (skill of agent().skills.slice(0, 3); track skill.name) {
          <span class="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs">
            {{ skill.name }}
          </span>
        }
        @if (agent().skills.length > 3) {
          <span class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            +{{ agent().skills.length - 3 }}
          </span>
        }
      </div>
    </div>
  `,
  styles: []
})
export class AgentCardComponent {
  agent = input.required<Agent>();

  formatType(): string {
    return this.agent().type.replace(/_/g, ' ');
  }

  getAgentIcon(): string {
    const iconMap: Record<string, string> = {
      'meta_project_manager': '🎯',
      'database': '🗄️',
      'ui_ux': '🎨',
      'documentation': '📚',
      'fullstack': '💻',
      'tester': '🧪',
      'security': '🔒',
      'optimization': '⚡'
    };

    return iconMap[this.agent().type] || '🤖';
  }
}
