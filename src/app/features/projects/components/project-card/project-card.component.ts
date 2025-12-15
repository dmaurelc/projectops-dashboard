import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '@core/models/project.model';
import { StatusBadgeComponent } from '@shared/components/ui/status-badge/status-badge.component';
import { StatusColorPipe } from '@shared/pipes/status-color.pipe';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    StatusBadgeComponent,
    StatusColorPipe,
    StatusLabelPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300">
      <!-- Gradient Header -->
      <div class="h-28 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div class="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTIgMThjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <!-- Content -->
      <div class="p-5 space-y-3">
        <!-- Title & Badge -->
        <div class="flex items-start justify-between gap-3">
          <h3 class="flex-1 text-lg font-semibold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors">
            {{ project.name }}
          </h3>
          <app-status-badge
            [label]="project.status | statusLabel"
            [variant]="project.status | statusColor"
            size="sm"
          />
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {{ project.description }}
        </p>

        <!-- Progress Bar -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-gray-700">Progress</span>
            <span class="font-bold text-primary-600">{{ project.progress }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
              [style.width.%]="project.progress"
            ></div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-2 border-t border-gray-100">
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">{{ project.startDate | dateFormat }}</span>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export class ProjectCardComponent {
  @Input() project!: Project;
}
