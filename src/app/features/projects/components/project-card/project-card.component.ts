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
    <div class="group rounded-lg border bg-card text-card-foreground transition-colors hover:bg-accent/50 cursor-pointer">
      <!-- Content -->
      <div class="flex flex-col space-y-1.5 p-6">
        <!-- Title & Badge -->
        <div class="flex items-start justify-between gap-3">
          <h3 class="flex-1 text-base font-semibold leading-none tracking-tight">
            {{ project.name }}
          </h3>
          <app-status-badge
            [label]="project.status | statusLabel"
            [variant]="project.status | statusColor"
            size="sm"
          />
        </div>

        <!-- Description -->
        <p class="text-sm text-muted-foreground line-clamp-2 pt-2">
          {{ project.description }}
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="px-6 pb-4 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-muted-foreground">Progress</span>
          <span class="font-medium">{{ project.progress }}%</span>
        </div>
        <div class="h-2 w-full rounded-full bg-secondary">
          <div
            class="h-full rounded-full bg-primary transition-all"
            [style.width.%]="project.progress"
          ></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center px-6 pb-6 pt-0">
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ project.startDate | dateFormat }}</span>
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
