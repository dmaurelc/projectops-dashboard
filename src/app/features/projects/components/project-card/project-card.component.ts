import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '@core/models/project.model';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { StatusBadgeComponent } from '@shared/components/ui/status-badge/status-badge.component';
import { StatusColorPipe } from '@shared/pipes/status-color.pipe';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    StatusBadgeComponent,
    StatusColorPipe,
    StatusLabelPipe,
    DateFormatPipe,
  ],
  template: `
    <app-card [clickable]="true">
      <div class="project-card">
        <div class="card-top">
          <h3>{{ project.name }}</h3>
          <app-status-badge
            [label]="project.status | statusLabel"
            [variant]="project.status | statusColor"
          />
        </div>
        <p class="description">{{ project.description }}</p>
        <div class="card-footer">
          <span class="date">{{ project.startDate | dateFormat }}</span>
          <span class="progress-badge">{{ project.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="project.progress"></div>
        </div>
      </div>
    </app-card>
  `,
  styles: [
    `
      .project-card {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.5rem;
      }

      h3 {
        margin: 0;
        font-size: 1.0625rem;
        font-weight: 600;
        color: #111827;
        line-height: 1.4;
        flex: 1;
      }

      .description {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
      }

      .date {
        font-size: 0.75rem;
        color: #9ca3af;
        font-weight: 500;
      }

      .progress-badge {
        font-size: 0.75rem;
        color: #3b82f6;
        font-weight: 600;
        background: #eff6ff;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
      }

      .progress-bar {
        width: 100%;
        height: 4px;
        background-color: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
        margin-top: 0.25rem;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #2563eb);
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 2px;
      }
    `,
  ],
})
export class ProjectCardComponent {
  @Input() project!: Project;
}
