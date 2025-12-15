import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPI } from '@core/models/metrics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card>
      <div class="kpi-card">
        <div class="kpi-icon" [style.backgroundColor]="getIconBg()">
          {{ kpi.icon }}
        </div>
        <div class="kpi-content">
          <h3 class="kpi-value">{{ kpi.value }}{{ kpi.unit || '' }}</h3>
          <p class="kpi-label">{{ kpi.label }}</p>
          <span *ngIf="kpi.trend" class="kpi-trend" [class.positive]="kpi.trend > 0">
            {{ kpi.trend > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.trend) }}%
          </span>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    .kpi-card {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .kpi-icon {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 1.5rem;
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-value {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
    }

    .kpi-label {
      margin: 0.25rem 0 0 0;
      font-size: 0.875rem;
      color: #666;
      text-transform: uppercase;
    }

    .kpi-trend {
      font-size: 0.875rem;
      color: #dc3545;
    }

    .kpi-trend.positive {
      color: #28a745;
    }
  `]
})
export class KpiCardComponent {
  @Input({ required: true }) kpi!: KPI;
  Math = Math;

  getIconBg(): string {
    const colors: Record<string, string> = {
      'blue': 'rgba(0, 123, 255, 0.1)',
      'green': 'rgba(40, 167, 69, 0.1)',
      'red': 'rgba(220, 53, 69, 0.1)',
      'purple': 'rgba(111, 66, 193, 0.1)'
    };
    return colors[this.kpi.color || 'blue'] || 'rgba(0, 123, 255, 0.1)';
  }
}
