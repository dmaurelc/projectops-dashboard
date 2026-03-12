import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember, TeamMemberCreateDto } from '@core/models/team-member.model';
import { TeamService } from '@core/services/team.service';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { OffcanvasComponent } from '@shared/components/ui/offcanvas/offcanvas.component';
import { MemberFormComponent } from '../../components/member-form/member-form.component';
import { MemberCardComponent } from '../../components/member-card/member-card.component';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    OffcanvasComponent,
    MemberFormComponent,
    MemberCardComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div class="container-custom max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div class="flex-1">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Team Overview
            </h1>
            <p class="text-gray-600 text-sm sm:text-base flex items-center gap-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage your team members and their availability
            </p>
          </div>
          <app-button variant="default" size="lg" (clicked)="openCreateOffcanvas()" class="self-start sm:self-auto">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Add Member</span>
          </app-button>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Members</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ teamService.members().length }}</p>
              </div>
              <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Active</p>
                <p class="text-3xl font-bold text-green-600 mt-2">{{ activeCount() }}</p>
              </div>
              <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Availability</p>
                <p class="text-3xl font-bold text-primary-600 mt-2">{{ avgAvailability() }}%</p>
              </div>
              <div class="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Skills</p>
                <p class="text-3xl font-bold text-purple-600 mt-2">{{ totalSkills() }}</p>
              </div>
              <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Members Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-member-card
            *ngFor="let member of teamService.members(); trackBy: trackByMemberId"
            [member]="member"
            (edit)="editMember($event)"
            (delete)="deleteMember($event)"
          />

          <!-- Empty State -->
          <div *ngIf="teamService.members().length === 0" class="col-span-full flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
              <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No team members yet</h3>
            <p class="text-sm text-gray-500 mb-8 text-center max-w-md">
              Start building your team by adding your first member. Track their availability and skills.
            </p>
            <app-button variant="default" size="lg" (clicked)="openCreateOffcanvas()">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Add First Member</span>
            </app-button>
          </div>
        </div>
      </div>

      <!-- Offcanvas -->
      <app-offcanvas
        *ngIf="showOffcanvas()"
        [title]="editingMember() ? 'Edit Team Member' : 'Add Team Member'"
        position="right"
        (close)="closeOffcanvas()"
      >
        <app-member-form
          [member]="editingMember()"
          (save)="onSaveMember($event)"
          (cancel)="closeOffcanvas()"
        />
      </app-offcanvas>
    </div>
  `,
  styles: [],
})
export class TeamOverviewComponent implements OnInit {
  teamService = inject(TeamService);
  showOffcanvas = signal(false);
  editingMember = signal<TeamMember | undefined>(undefined);

  activeCount = computed(() =>
    this.teamService.members().filter(m => m.isActive).length
  );

  avgAvailability = computed(() => {
    const members = this.teamService.members();
    if (members.length === 0) return 0;
    const sum = members.reduce((acc, m) => acc + m.availability, 0);
    return Math.round(sum / members.length);
  });

  totalSkills = computed(() => {
    const allSkills = new Set<string>();
    this.teamService.members().forEach(m => {
      m.skills?.forEach(skill => allSkills.add(skill));
    });
    return allSkills.size;
  });

  ngOnInit(): void {
    this.teamService.loadMembers();
  }

  openCreateOffcanvas(): void {
    this.editingMember.set(undefined);
    this.showOffcanvas.set(true);
  }

  closeOffcanvas(): void {
    this.showOffcanvas.set(false);
    this.editingMember.set(undefined);
  }

  editMember(member: TeamMember): void {
    this.editingMember.set(member);
    this.showOffcanvas.set(true);
  }

  async onSaveMember(memberData: TeamMemberCreateDto | any): Promise<void> {
    if (this.editingMember()) {
      await this.teamService.updateMember(memberData);
    } else {
      await this.teamService.createMember(memberData);
    }
    this.closeOffcanvas();
  }

  async deleteMember(member: TeamMember): Promise<void> {
    if (confirm(`Are you sure you want to remove "${member.name}" from the team? This action cannot be undone.`)) {
      await this.teamService.deleteMember(member.id);
    }
  }

  trackByMemberId(_index: number, member: TeamMember): string {
    return member.id;
  }
}
