export interface KPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  icon?: string;
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface MetricsData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamUtilization: number;
  projectsByStatus: ChartData;
  tasksByPriority: ChartData;
  teamWorkload: ChartData;
  progressOverTime: ChartData;
}
