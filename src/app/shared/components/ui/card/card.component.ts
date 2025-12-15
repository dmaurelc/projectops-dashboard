import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.clickable]="clickable">
      <div class="card-header" *ngIf="title">
        <h3>{{ title }}</h3>
        <div class="card-actions" *ngIf="hasActions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        overflow: hidden;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .card.clickable {
        cursor: pointer;
      }

      .card.clickable:hover {
        border-color: #d1d5db;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transform: translateY(-1px);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #f3f4f6;
        background: #fafbfc;
      }

      .card-header h3 {
        margin: 0;
        font-size: 0.9375rem;
        font-weight: 600;
        color: #111827;
        letter-spacing: -0.01em;
      }

      .card-content {
        padding: 1.25rem;
      }

      .card-footer {
        padding: 0.875rem 1.25rem;
      }
    `,
  ],
})
export class CardComponent {
  @Input() title?: string;
  @Input() clickable = false;
  @Input() hasActions = false;
  @Input() hasFooter = false;
}
