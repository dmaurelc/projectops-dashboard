import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsData, KPI } from '@core/models/metrics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../components/chart-card/chart-card.component';
import { MetricsSummaryComponent } from '../../components/metrics-summary/metrics-summary.component';

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    KpiCardComponent,
    ChartCardComponent,
    MetricsSummaryComponent
  ],
  template: `
    <div class="metrics-dashboard">
      <div class="dashboard-header">
        <h1>Metrics Dashboard</h1>
        <app-button variant="outline" (clicked)="refreshMetrics()">
          Refresh
        </app-button>
      </div>

      <div class="dashboard-content">
        <!-- KPI Cards -->
        <div class="kpi-grid">
          <app-kpi-card *ngFor="let kpi of kpis()" [kpi]="kpi" />
        </div>

        <!-- Metrics Summary -->
        <app-metrics-summary [metrics]="metrics()" />

        <!-- Charts Section -->
        <div class="charts-grid">
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
  `,
  styles: [`
    .metrics-dashboard {
      padding: 2rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
  `]
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
}
