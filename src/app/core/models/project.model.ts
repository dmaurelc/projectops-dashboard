import { ProjectStatus } from './status.model';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  teamMemberIds: string[];
  budget?: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCreateDto {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  teamMemberIds: string[];
  budget?: number;
}

export interface ProjectUpdateDto extends Partial<ProjectCreateDto> {
  id: string;
}
