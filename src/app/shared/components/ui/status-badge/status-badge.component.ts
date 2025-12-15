import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'badge badge-' + variant">
      <span class="dot"></span>
      {{ label }}
    </span>
  `,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1;
        border-radius: 5px;
        text-align: center;
        white-space: nowrap;
        text-transform: capitalize;
        letter-spacing: 0.3px;
      }

      .dot {
        display: inline-block;
        width: 0.375rem;
        height: 0.375rem;
        border-radius: 50%;
      }

      .badge-primary {
        background-color: #dbeafe;
        color: #1e40af;
      }

      .badge-primary .dot {
        background-color: #1e40af;
      }

      .badge-success {
        background-color: #d1fae5;
        color: #065f46;
      }

      .badge-success .dot {
        background-color: #065f46;
      }

      .badge-warning {
        background-color: #fef3c7;
        color: #92400e;
      }

      .badge-warning .dot {
        background-color: #92400e;
      }

      .badge-danger {
        background-color: #fee2e2;
        color: #991b1b;
      }

      .badge-danger .dot {
        background-color: #991b1b;
      }

      .badge-info {
        background-color: #e0e7ff;
        color: #3730a3;
      }

      .badge-info .dot {
        background-color: #3730a3;
      }

      .badge-secondary {
        background-color: #f3f4f6;
        color: #374151;
      }

      .badge-secondary .dot {
        background-color: #374151;
      }

      .badge-light {
        background-color: #f9fafb;
        color: #6b7280;
        border: 1px solid #e5e7eb;
      }

      .badge-light .dot {
        background-color: #6b7280;
      }

      .badge-dark {
        background-color: #1f2937;
        color: #f9fafb;
      }

      .badge-dark .dot {
        background-color: #f9fafb;
      }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input() label: string = '';
  @Input() variant:
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'secondary'
    | 'light'
    | 'dark' = 'primary';
}
