import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPI } from '@core/models/metrics.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div class="flex items-center justify-between mb-4">
        <!-- Icon Circle -->
        <div [class]="iconCircleClasses()" class="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
          {{ kpi.icon }}
        </div>

        <!-- Trend Badge -->
        <div *ngIf="kpi.trend" [class]="trendBadgeClasses()" class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path *ngIf="kpi.trend > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            <path *ngIf="kpi.trend <= 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>{{ Math.abs(kpi.trend) }}%</span>
        </div>
      </div>

      <!-- Value & Label -->
      <div class="space-y-1">
        <h3 [class]="valueClasses()" class="text-4xl font-bold leading-none">
          {{ kpi.value }}<span class="text-2xl opacity-75">{{ kpi.unit || '' }}</span>
        </h3>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {{ kpi.label }}
        </p>
      </div>

      <!-- Progress Bar (decorative) -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div [class]="progressBarClasses()" class="h-full rounded-full transition-all duration-1000 ease-out" style="width: 75%"></div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class KpiCardComponent {
  @Input({ required: true }) kpi!: KPI;
  Math = Math;

  protected iconCircleClasses = computed(() => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 text-blue-600',
      'green': 'bg-green-100 text-green-600',
      'red': 'bg-red-100 text-red-600',
      'purple': 'bg-purple-100 text-purple-600',
      'success': 'bg-emerald-100 text-emerald-600',
    };
    return colorMap[this.kpi.color || 'blue'] || 'bg-blue-100 text-blue-600';
  });

  protected valueClasses = computed(() => {
    const colorMap: Record<string, string> = {
      'blue': 'text-blue-600',
      'green': 'text-green-600',
      'red': 'text-red-600',
      'purple': 'text-purple-600',
      'success': 'text-emerald-600',
    };
    return colorMap[this.kpi.color || 'blue'] || 'text-blue-600';
  });

  protected trendBadgeClasses = computed(() => {
    if (!this.kpi.trend) return '';
    return this.kpi.trend > 0
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  });

  protected progressBarClasses = computed(() => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'green': 'bg-gradient-to-r from-green-500 to-green-600',
      'red': 'bg-gradient-to-r from-red-500 to-red-600',
      'purple': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'success': 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    };
    return colorMap[this.kpi.color || 'blue'] || 'bg-gradient-to-r from-blue-500 to-blue-600';
  });
}
