import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { ChartData } from '@core/models/metrics.model';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card [title]="title">
      <div class="chart-container">
        <p>Chart placeholder for: {{ title }}</p>
        <p class="note">Chart.js integration needed</p>
      </div>
    </app-card>
  `,
  styles: [`
    .chart-container {
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    p {
      margin: 0.5rem 0;
      color: #666;
    }

    .note {
      font-size: 0.875rem;
      font-style: italic;
      color: #999;
    }
  `]
})
export class ChartCardComponent {
  @Input({ required: true }) title!: string;
  @Input() data?: ChartData;
}
