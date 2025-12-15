import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent } from '@core/agents/models/agent.model';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="agent-card" [class]="'status-' + agent().status">
      <div class="agent-header">
        <div class="agent-icon">
          {{ getAgentIcon() }}
        </div>
        <div class="agent-info">
          <h3>{{ agent().name }}</h3>
          <span class="agent-type">{{ formatType() }}</span>
        </div>
        <span class="status-indicator" [class]="'status-' + agent().status">
          {{ agent().status }}
        </span>
      </div>

      <p class="agent-description">{{ agent().description }}</p>

      <div class="agent-stats">
        <div class="stat">
          <span class="stat-label">Skills</span>
          <span class="stat-value">{{ agent().skills.length }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Success</span>
          <span class="stat-value">{{ agent().successRate }}%</span>
        </div>
        <div class="stat">
          <span class="stat-label">Tasks</span>
          <span class="stat-value">{{ agent().tasksCompleted }}</span>
        </div>
      </div>

      <div class="agent-skills">
        @for (skill of agent().skills.slice(0, 3); track skill.name) {
          <span class="skill-badge" [class]="'level-' + skill.level">
            {{ skill.name }}
          </span>
        }
        @if (agent().skills.length > 3) {
          <span class="skill-badge more">+{{ agent().skills.length - 3 }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .agent-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s;
    }

    .agent-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .agent-card.status-working {
      border-left: 4px solid #2563eb;
    }

    .agent-card.status-idle {
      border-left: 4px solid #10b981;
    }

    .agent-card.status-error {
      border-left: 4px solid #ef4444;
    }

    .agent-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .agent-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .agent-info {
      flex: 1;
    }

    .agent-info h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: #1a1a1a;
    }

    .agent-type {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-indicator {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-indicator.status-idle {
      background: #d1fae5;
      color: #065f46;
    }

    .status-indicator.status-working {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-indicator.status-waiting {
      background: #fef3c7;
      color: #92400e;
    }

    .status-indicator.status-error {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-indicator.status-paused {
      background: #f3f4f6;
      color: #4b5563;
    }

    .agent-description {
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .agent-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    .agent-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #f3f4f6;
      color: #4b5563;
    }

    .skill-badge.level-expert,
    .skill-badge.level-master {
      background: #dbeafe;
      color: #1e40af;
    }

    .skill-badge.level-advanced {
      background: #e0e7ff;
      color: #4338ca;
    }

    .skill-badge.more {
      background: #e5e7eb;
      color: #6b7280;
    }
  `]
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
