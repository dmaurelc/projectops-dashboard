import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsData, KPI } from '@core/models/metrics.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../components/chart-card/chart-card.component';
import { MetricsSummaryComponent } from '../../components/metrics-summary/metrics-summary.component';

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    KpiCardComponent,
    ChartCardComponent,
    MetricsSummaryComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div class="container-custom max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div class="flex-1">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Metrics Dashboard
            </h1>
            <p class="text-gray-600 text-sm sm:text-base flex items-center gap-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Track performance and key metrics in real-time
            </p>
          </div>
          <div class="flex items-center gap-3 self-start sm:self-auto">
            <app-button variant="outline" size="md" (clicked)="refreshMetrics()">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </app-button>
            <app-button variant="primary" size="md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </app-button>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
          <app-kpi-card *ngFor="let kpi of kpis(); trackBy: trackByKpiId" [kpi]="kpi" />
        </div>

        <!-- Metrics Summary -->
        <div class="mb-8">
          <app-metrics-summary [metrics]="metrics()" />
        </div>

        <!-- Charts Section -->
        <div class="space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">Analytics</h2>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Last 7 days
              </button>
              <button class="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg">
                Last 30 days
              </button>
              <button class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Last 90 days
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-chart-card
              title="Projects by Status"
              [data]="metrics().projectsByStatus"
            />
            <app-chart-card
              title="Tasks by Priority"
              [data]="metrics().tasksByPriority"
            />
            <app-chart-card
              title="Team Workload"
              [data]="metrics().teamWorkload"
            />
            <app-chart-card
              title="Progress Over Time"
              [data]="metrics().progressOverTime"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MetricsDashboardComponent {
  metrics = signal<MetricsData>({
    totalProjects: 6,
    activeProjects: 3,
    completedProjects: 1,
    totalTasks: 8,
    completedTasks: 2,
    overdueTasks: 1,
    teamUtilization: 87,
    projectsByStatus: {
      labels: ['In Progress', 'Planning', 'Completed', 'On Hold'],
      datasets: [{
        label: 'Projects',
        data: [3, 1, 1, 1],
        backgroundColor: ['#007bff', '#ffc107', '#28a745', '#6c757d']
      }]
    },
    tasksByPriority: {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        label: 'Tasks',
        data: [2, 2, 3, 1],
        backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#6c757d']
      }]
    },
    teamWorkload: {
      labels: ['Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda', 'Chris'],
      datasets: [{
        label: 'Availability %',
        data: [90, 100, 85, 95, 100, 75, 80, 50]
      }]
    },
    progressOverTime: {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{
        label: 'Completed Tasks',
        data: [5, 8, 2]
      }]
    }
  });

  kpis = computed<KPI[]>(() => {
    const data = this.metrics();
    return [
      {
        id: 'total-projects',
        label: 'Total Projects',
        value: data.totalProjects,
        icon: '📁',
        color: 'blue',
        trend: 12
      },
      {
        id: 'active-projects',
        label: 'Active Projects',
        value: data.activeProjects,
        icon: '▶',
        color: 'green',
        trend: 8
      },
      {
        id: 'completed-tasks',
        label: 'Completed Tasks',
        value: data.completedTasks,
        unit: `/${data.totalTasks}`,
        icon: '✓',
        color: 'success',
        trend: -5
      },
      {
        id: 'overdue-tasks',
        label: 'Overdue Tasks',
        value: data.overdueTasks,
        icon: '⚠',
        color: 'red',
        trend: -15
      },
      {
        id: 'team-utilization',
        label: 'Team Utilization',
        value: data.teamUtilization,
        unit: '%',
        icon: '👥',
        color: 'purple',
        trend: 3
      }
    ];
  });

  refreshMetrics(): void {
    console.log('Refreshing metrics...');
  }

  trackByKpiId(_index: number, kpi: KPI): string {
    return kpi.id;
  }
}
