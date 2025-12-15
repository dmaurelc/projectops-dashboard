export enum MemberRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  QA = 'qa',
  STAKEHOLDER = 'stakeholder'
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatar?: string;
  projectIds: string[];
  skills: string[];
  availability: number;
  isActive: boolean;
  joinedDate: Date;
}

export interface TeamMemberCreateDto {
  name: string;
  email: string;
  role: MemberRole;
  avatar?: string;
  skills?: string[];
  availability?: number;
}

export interface TeamMemberUpdateDto extends Partial<TeamMemberCreateDto> {
  id: string;
}
