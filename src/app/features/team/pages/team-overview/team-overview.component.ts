import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember, TeamMemberCreateDto } from '@core/models/team-member.model';
import { TeamService } from '@core/services/team.service';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { OffcanvasComponent } from '@shared/components/ui/offcanvas/offcanvas.component';
import { MemberFormComponent } from '../../components/member-form/member-form.component';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    OffcanvasComponent,
    MemberFormComponent,
  ],
  template: `
    <div class="team-overview">
      <div class="overview-header">
        <h1>Team Overview</h1>
        <app-button variant="primary" (clicked)="openCreateOffcanvas()">
          + Add Member
        </app-button>
      </div>

      <div class="members-grid">
        <app-card *ngFor="let member of teamService.members()">
          <div class="member-card">
            <div class="member-avatar">
              <img *ngIf="member.avatar" [src]="member.avatar" [alt]="member.name" />
              <div *ngIf="!member.avatar" class="avatar-placeholder">
                {{ member.name.charAt(0) }}
              </div>
            </div>
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <p class="role">{{ member.role }}</p>
              <p class="email">{{ member.email }}</p>
              <div class="member-details">
                <span class="detail-item">
                  <strong>Skills:</strong> {{ member.skills?.join(', ') || 'None' }}
                </span>
                <span class="detail-item">
                  <strong>Availability:</strong> {{ member.availability }}%
                </span>
                <span class="detail-item" [class.inactive]="!member.isActive">
                  {{ member.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="member-actions">
                <app-button variant="outline" size="sm" (clicked)="editMember(member)">
                  Edit
                </app-button>
                <app-button variant="danger" size="sm" (clicked)="deleteMember(member)">
                  Delete
                </app-button>
              </div>
            </div>
          </div>
        </app-card>
        <div *ngIf="teamService.members().length === 0" class="empty-state">
          No team members yet. Add your first member!
        </div>
      </div>

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
  styles: [`
    .team-overview {
      padding: 2rem;
    }

    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .overview-header h1 {
      margin: 0;
      font-size: 2rem;
      color: #111827;
      font-weight: 700;
    }

    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .member-card {
      display: flex;
      gap: 1rem;
    }

    .member-avatar {
      flex-shrink: 0;
    }

    .member-avatar img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }

    .avatar-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
    }

    .member-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .member-info h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #111827;
      font-weight: 600;
    }

    .role {
      margin: 0;
      color: #6b7280;
      font-weight: 500;
      text-transform: capitalize;
      font-size: 0.875rem;
    }

    .email {
      margin: 0;
      color: #9ca3af;
      font-size: 0.8125rem;
    }

    .member-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .detail-item {
      font-size: 0.8125rem;
      color: #6b7280;
    }

    .detail-item strong {
      color: #374151;
    }

    .detail-item.inactive {
      color: #dc2626;
    }

    .member-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f3f4f6;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
      font-size: 1rem;
    }
  `]
})
export class TeamOverviewComponent implements OnInit {
  teamService = inject(TeamService);
  showOffcanvas = signal(false);
  editingMember = signal<TeamMember | undefined>(undefined);

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
}
