import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '@core/models/team-member.model';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card>
      <div class="member-card">
        <div class="avatar">
          {{ member.name.charAt(0) }}
        </div>
        <div class="info">
          <h4>{{ member.name }}</h4>
          <p class="role">{{ member.role }}</p>
          <p class="email">{{ member.email }}</p>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    .member-card {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #007bff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .info {
      flex: 1;
    }

    h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      color: #333;
    }

    .role {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
      text-transform: capitalize;
    }

    .email {
      margin: 0;
      font-size: 0.8rem;
      color: #888;
    }
  `]
})
export class MemberCardComponent {
  @Input({ required: true }) member!: TeamMember;
}
