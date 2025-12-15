import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="'btn btn-' + variant + ' btn-' + size"
      [disabled]="disabled || loading"
      (click)="handleClick($event)"
    >
      <span *ngIf="loading" class="spinner"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 500;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: inherit;
        white-space: nowrap;
        user-select: none;
        outline: none;
      }

      .btn:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Sizes */
      .btn-sm {
        padding: 0.5rem 0.875rem;
        font-size: 0.8125rem;
        letter-spacing: 0.3px;
      }

      .btn-md {
        padding: 0.625rem 1rem;
        font-size: 0.875rem;
        letter-spacing: 0.25px;
      }

      .btn-lg {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }

      /* Primary */
      .btn-primary {
        background: #3b82f6;
        color: white;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }

      .btn-primary:hover:not(:disabled) {
        background: #2563eb;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      /* Secondary */
      .btn-secondary {
        background: #6b7280;
        color: white;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #4b5563;
      }

      /* Outline */
      .btn-outline {
        background: transparent;
        color: #3b82f6;
        border: 1px solid #e5e7eb;
      }

      .btn-outline:hover:not(:disabled) {
        background: #f3f4f6;
        border-color: #d1d5db;
      }

      /* Success */
      .btn-success {
        background: #10b981;
        color: white;
      }

      .btn-success:hover:not(:disabled) {
        background: #059669;
      }

      /* Danger */
      .btn-danger {
        background: #ef4444;
        color: white;
      }

      .btn-danger:hover:not(:disabled) {
        background: #dc2626;
      }

      /* Warning */
      .btn-warning {
        background: #f59e0b;
        color: white;
      }

      .btn-warning:hover:not(:disabled) {
        background: #d97706;
      }

      /* Info */
      .btn-info {
        background: #3b82f6;
        color: white;
      }

      .btn-info:hover:not(:disabled) {
        background: #2563eb;
      }

      /* Light */
      .btn-light {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #e5e7eb;
      }

      .btn-light:hover:not(:disabled) {
        background: #e5e7eb;
        border-color: #d1d5db;
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() variant:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
