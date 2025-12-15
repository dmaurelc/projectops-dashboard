import { Injectable, signal, computed, inject } from '@angular/core';
import { TeamMember, TeamMemberCreateDto, TeamMemberUpdateDto } from '../models/team-member.model';
import { JsonDatabaseService } from './json-database.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private db = inject(JsonDatabaseService);

  private membersState = signal<TeamMember[]>([]);
  private selectedMemberState = signal<TeamMember | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  readonly members = this.membersState.asReadonly();
  readonly selectedMember = this.selectedMemberState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly activeMembers = computed(() =>
    this.membersState().filter(m => m.isActive)
  );

  readonly membersByRole = computed(() => {
    const map = new Map<string, TeamMember[]>();
    this.membersState().forEach(member => {
      const members = map.get(member.role) || [];
      members.push(member);
      map.set(member.role, members);
    });
    return map;
  });

  async loadMembers(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const members = await this.db.getTeamMembers();
      this.membersState.set(members);
    } catch (error) {
      this.errorState.set('Error loading team members');
      console.error('Error loading team members:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async loadMemberById(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const member = await this.db.getTeamMemberById(id);
      this.selectedMemberState.set(member);
    } catch (error) {
      this.errorState.set('Error loading team member');
      console.error('Error loading team member:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async createMember(data: TeamMemberCreateDto): Promise<TeamMember | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newMember: TeamMember = {
        id: this.db.generateId('teamMembers'),
        ...data,
        projectIds: [],
        skills: data.skills || [],
        availability: data.availability ?? 100,
        isActive: true,
        joinedDate: new Date(),
      };
      const member = await this.db.createTeamMember(newMember);
      this.membersState.update(members => [...members, member]);
      return member;
    } catch (error) {
      this.errorState.set('Error creating team member');
      console.error('Error creating team member:', error);
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  async updateMember(data: TeamMemberUpdateDto): Promise<TeamMember | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const member = await this.db.updateTeamMember(data.id, data);
      if (member) {
        this.membersState.update(members =>
          members.map(m => m.id === member.id ? member : m)
        );
        if (this.selectedMemberState()?.id === member.id) {
          this.selectedMemberState.set(member);
        }
        return member;
      }
      return null;
    } catch (error) {
      this.errorState.set('Error updating team member');
      console.error('Error updating team member:', error);
      return null;
    } finally {
      this.loadingState.set(false);
    }
  }

  async deleteMember(id: string): Promise<boolean> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const success = await this.db.deleteTeamMember(id);
      if (success) {
        this.membersState.update(members => members.filter(m => m.id !== id));
        if (this.selectedMemberState()?.id === id) {
          this.selectedMemberState.set(null);
        }
      }
      return success;
    } catch (error) {
      this.errorState.set('Error deleting team member');
      console.error('Error deleting team member:', error);
      return false;
    } finally {
      this.loadingState.set(false);
    }
  }

  getMemberById(id: string): TeamMember | undefined {
    return this.membersState().find(m => m.id === id);
  }

  clearSelectedMember(): void {
    this.selectedMemberState.set(null);
  }
}
