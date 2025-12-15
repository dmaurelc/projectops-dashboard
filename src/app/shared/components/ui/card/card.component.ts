import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50/50" *ngIf="title">
        <h3 class="text-base font-semibold text-gray-900 tracking-tight">{{ title }}</h3>
        <div class="flex items-center gap-2" *ngIf="hasActions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
      <div [class]="contentClasses()">
        <ng-content></ng-content>
      </div>
      <div class="px-5 py-3.5 border-t border-gray-100 bg-gray-50/30" *ngIf="hasFooter">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [],
})
export class CardComponent {
  @Input() title?: string;
  @Input() variant: 'default' | 'elevated' | 'bordered' | 'glass' = 'default';
  @Input() clickable = false;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hasActions = false;
  @Input() hasFooter = false;

  protected cardClasses = computed(() => {
    const baseClasses = 'bg-white rounded-xl overflow-hidden transition-all duration-300';

    const variantClasses = {
      default: 'shadow-md hover:shadow-lg',
      elevated: 'shadow-xl hover:shadow-2xl',
      bordered: 'border-2 border-gray-200 hover:border-gray-300',
      glass: 'bg-white/70 backdrop-blur-lg shadow-glass border border-white/20',
    };

    const clickableClasses = this.clickable
      ? 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]'
      : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${clickableClasses}`;
  });

  protected contentClasses = computed(() => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-8',
    };

    return paddingClasses[this.padding];
  });
}
