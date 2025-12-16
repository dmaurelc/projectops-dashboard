import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '@core/models/team-member.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="rounded-lg border bg-card text-card-foreground">
      <!-- Content -->
      <div class="flex flex-col space-y-1.5 p-6">
        <!-- Avatar & Name -->
        <div class="flex items-start gap-4">
          <div *ngIf="member.avatar" class="h-12 w-12 rounded-full overflow-hidden">
            <img [src]="member.avatar" [alt]="member.name" class="h-full w-full object-cover" />
          </div>
          <div *ngIf="!member.avatar" class="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {{ member.name.charAt(0).toUpperCase() }}
          </div>

          <div class="flex-1">
            <h3 class="font-semibold leading-none tracking-tight">
              {{ member.name }}
            </h3>
            <p class="text-sm text-muted-foreground mt-1">
              {{ member.role }}
            </p>
          </div>

          <!-- Status -->
          <span *ngIf="member.isActive" class="inline-flex h-6 items-center gap-1 rounded-md border border-input bg-background px-2 text-xs">
            <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>
            Active
          </span>
        </div>

        <!-- Email -->
        <p class="text-sm text-muted-foreground truncate pt-2">
          {{ member.email }}
        </p>

        <!-- Skills -->
        <div *ngIf="member.skills && member.skills.length > 0" class="flex flex-wrap gap-1.5 pt-2">
          <span *ngFor="let skill of member.skills" class="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs">
            {{ skill }}
          </span>
        </div>

        <!-- Availability -->
        <div class="pt-3">
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="text-muted-foreground">Availability</span>
            <span class="font-medium">{{ member.availability }}%</span>
          </div>
          <div class="h-2 w-full rounded-full bg-secondary">
            <div
              class="h-full rounded-full bg-primary transition-all"
              [style.width.%]="member.availability"
            ></div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 p-6 pt-0">
        <app-button variant="outline" size="sm" (clicked)="handleEdit()" class="flex-1">
          Edit
        </app-button>
        <app-button variant="destructive" size="sm" (clicked)="handleDelete()">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </app-button>
      </div>
    </div>
  `,
  styles: [],
})
export class MemberCardComponent {
  @Input({ required: true }) member!: TeamMember;
  @Output() edit = new EventEmitter<TeamMember>();
  @Output() delete = new EventEmitter<TeamMember>();

  handleEdit(): void {
    this.edit.emit(this.member);
  }

  handleDelete(): void {
    this.delete.emit(this.member);
  }
}
