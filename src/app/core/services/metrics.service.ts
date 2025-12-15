import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MetricsData, KPI } from '../models/metrics.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/metrics`;

  private metricsState = signal<MetricsData | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  readonly metrics = this.metricsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly kpis = computed<KPI[]>(() => {
    const data = this.metricsState();
    if (!data) return [];

    return [
      {
        id: 'total-projects',
        label: 'Total Projects',
        value: data.totalProjects,
        icon: 'folder',
        color: 'blue'
      },
      {
        id: 'active-projects',
        label: 'Active Projects',
        value: data.activeProjects,
        icon: 'play',
        color: 'green'
      },
      {
        id: 'completed-tasks',
        label: 'Completed Tasks',
        value: data.completedTasks,
        unit: `/${data.totalTasks}`,
        icon: 'check',
        color: 'success'
      },
      {
        id: 'overdue-tasks',
        label: 'Overdue Tasks',
        value: data.overdueTasks,
        icon: 'warning',
        color: 'red'
      },
      {
        id: 'team-utilization',
        label: 'Team Utilization',
        value: data.teamUtilization,
        unit: '%',
        icon: 'users',
        color: 'purple'
      }
    ];
  });

  async loadMetrics(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const metrics = await this.http.get<MetricsData>(this.apiUrl).toPromise();
      this.metricsState.set(metrics || null);
    } catch (error) {
      this.errorState.set('Error loading metrics');
      console.error('Error loading metrics:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async refreshMetrics(): Promise<void> {
    await this.loadMetrics();
  }
}
