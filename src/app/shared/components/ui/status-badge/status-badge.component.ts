import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()">
      <span *ngIf="showDot" [class]="dotClasses()"></span>
      {{ label }}
    </span>
  `,
  styles: [],
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
  @Input() showDot: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() pill: boolean = true;

  protected badgeClasses = computed(() => {
    const baseClasses = 'inline-flex items-center gap-1.5 font-medium whitespace-nowrap capitalize';

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };

    const shapeClasses = this.pill ? 'rounded-full' : 'rounded';

    const variantClasses = {
      primary: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20',
      success: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20',
      warning: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
      danger: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20',
      info: 'bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-600/20',
      secondary: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-600/20',
      light: 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300',
      dark: 'bg-gray-900 text-gray-100 ring-1 ring-inset ring-gray-700',
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${shapeClasses} ${variantClasses[this.variant]}`;
  });

  protected dotClasses = computed(() => {
    const sizeClasses = {
      sm: 'w-1 h-1',
      md: 'w-1.5 h-1.5',
      lg: 'w-2 h-2',
    };

    const variantClasses = {
      primary: 'bg-blue-600',
      success: 'bg-green-600 animate-pulse-slow',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600 animate-pulse',
      info: 'bg-indigo-600',
      secondary: 'bg-gray-600',
      light: 'bg-gray-500',
      dark: 'bg-gray-100',
    };

    return `inline-block rounded-full ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  });
}
