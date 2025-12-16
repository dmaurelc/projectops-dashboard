import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offcanvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black/50 animate-in fade-in duration-150 z-50"
      (click)="close.emit()"
    ></div>

    <!-- Sheet -->
    <div
      class="fixed inset-y-0 flex flex-col bg-background border-l z-50 w-full sm:max-w-lg animate-in duration-150"
      [class.right-0]="position === 'right'"
      [class.left-0]="position === 'left'"
      [class.slide-in-from-right]="position === 'right'"
      [class.slide-in-from-left]="position === 'left'"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b px-6 py-4">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <button
          (click)="close.emit()"
          class="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none p-1"
          aria-label="Close"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class OffcanvasComponent {
  @Input() title = '';
  @Input() position: 'left' | 'right' = 'right';
  @Output() close = new EventEmitter<void>();
}
