import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsData } from '@core/models/metrics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-metrics-summary',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card title="Summary">
      <div class="summary-grid" *ngIf="metrics">
        <div class="summary-item">
          <span class="label">Total Projects:</span>
          <span class="value">{{ metrics.totalProjects }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Active Projects:</span>
          <span class="value">{{ metrics.activeProjects }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Total Tasks:</span>
          <span class="value">{{ metrics.totalTasks }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Team Utilization:</span>
          <span class="value">{{ metrics.teamUtilization }}%</span>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .label {
      font-size: 0.875rem;
      color: #666;
      font-weight: 600;
    }

    .value {
      font-size: 1.5rem;
      color: #333;
      font-weight: 700;
    }
  `]
})
export class MetricsSummaryComponent {
  @Input() metrics?: MetricsData;
}
