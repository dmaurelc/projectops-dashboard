import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offcanvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="offcanvas-overlay" (click)="close.emit()"></div>
    <div class="offcanvas" [class.offcanvas-right]="position === 'right'">
      <div class="offcanvas-header">
        <h2>{{ title }}</h2>
        <button class="close-button" (click)="close.emit()" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="offcanvas-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      display: flex;
    }

    .offcanvas-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .offcanvas {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      max-width: 500px;
      background: white;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      animation: slideInLeft 0.3s ease-out;
    }

    .offcanvas-right {
      left: auto;
      right: 0;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      animation: slideInRight 0.3s ease-out;
    }

    @keyframes slideInLeft {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .offcanvas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: #fafbfc;
    }

    .offcanvas-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .close-button {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-button:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .offcanvas-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    @media (max-width: 640px) {
      .offcanvas {
        max-width: 100%;
      }
    }
  `]
})
export class OffcanvasComponent {
  @Input() title = '';
  @Input() position: 'left' | 'right' = 'right';
  @Output() close = new EventEmitter<void>();
}
