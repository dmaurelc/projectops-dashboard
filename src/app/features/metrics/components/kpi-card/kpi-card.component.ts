import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPI } from '@core/models/metrics.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-lg border bg-card text-card-foreground">
      <div class="flex flex-col space-y-1.5 p-6">
        <!-- Label -->
        <p class="text-sm text-muted-foreground">
          {{ kpi.label }}
        </p>

        <!-- Value & Trend -->
        <div class="flex items-baseline justify-between">
          <h3 class="text-3xl font-semibold tracking-tight">
            {{ kpi.value }}<span class="text-base text-muted-foreground ml-1">{{ kpi.unit || '' }}</span>
          </h3>

          <!-- Trend -->
          <span *ngIf="kpi.trend" class="text-xs" [class.text-green-600]="kpi.trend > 0" [class.text-red-600]="kpi.trend <= 0">
            {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class KpiCardComponent {
  @Input({ required: true }) kpi!: KPI;
  Math = Math;
}
