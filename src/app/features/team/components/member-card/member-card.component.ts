import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '@core/models/team-member.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <!-- Header con gradiente -->
      <div class="h-24 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <!-- Status Badge -->
        <div class="absolute top-3 right-3">
          <span [class]="statusBadgeClasses()" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span [class]="statusDotClasses()" class="w-2 h-2 rounded-full"></span>
            {{ member.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <!-- Avatar (sobrepuesto al header) -->
      <div class="relative px-6 pb-6">
        <div class="-mt-12 mb-4">
          <div *ngIf="member.avatar" class="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            <img [src]="member.avatar" [alt]="member.name" class="w-full h-full object-cover" />
          </div>
          <div *ngIf="!member.avatar" [class]="avatarClasses()" class="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold">
            {{ member.name.charAt(0).toUpperCase() }}
          </div>
        </div>

        <!-- Member Info -->
        <div class="space-y-3">
          <!-- Name & Role -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary-600 transition-colors">
              {{ member.name }}
            </h3>
            <p class="text-sm font-medium text-primary-600 capitalize">
              {{ member.role }}
            </p>
          </div>

          <!-- Email -->
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="truncate">{{ member.email }}</span>
          </div>

          <!-- Skills -->
          <div *ngIf="member.skills && member.skills.length > 0" class="pt-2">
            <div class="flex flex-wrap gap-1.5">
              <span *ngFor="let skill of member.skills" class="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Availability Bar -->
          <div class="pt-2">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-gray-700">Availability</span>
              <span class="text-xs font-bold text-primary-600">{{ member.availability }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                [class]="availabilityBarClasses()"
                class="h-full rounded-full transition-all duration-500"
                [style.width.%]="member.availability"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-3 border-t border-gray-100">
            <app-button variant="outline" size="sm" (clicked)="handleEdit()" class="flex-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </app-button>
            <app-button variant="danger" size="sm" (clicked)="handleDelete()">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MemberCardComponent {
  @Input({ required: true }) member!: TeamMember;
  @Output() edit = new EventEmitter<TeamMember>();
  @Output() delete = new EventEmitter<TeamMember>();

  protected avatarClasses = computed(() => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-red-500 to-red-600',
    ];
    const index = this.member.name.charCodeAt(0) % colors.length;
    return colors[index];
  });

  protected statusBadgeClasses = computed(() => {
    return this.member.isActive
      ? 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20'
      : 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-600/20';
  });

  protected statusDotClasses = computed(() => {
    return this.member.isActive
      ? 'bg-green-600 animate-pulse'
      : 'bg-gray-400';
  });

  protected availabilityBarClasses = computed(() => {
    const availability = this.member.availability;
    if (availability >= 75) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (availability >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (availability >= 25) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  });

  handleEdit(): void {
    this.edit.emit(this.member);
  }

  handleDelete(): void {
    this.delete.emit(this.member);
  }
}
