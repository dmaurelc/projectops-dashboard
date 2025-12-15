import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <!-- Card Header -->
      <div class="flex flex-row items-center justify-between space-y-0 pb-2" [class.p-6]="title || hasActions" *ngIf="title || hasActions">
        <h3 class="text-sm font-medium leading-none tracking-tight" *ngIf="title">{{ title }}</h3>
        <div class="flex items-center gap-2" *ngIf="hasActions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>

      <!-- Card Content -->
      <div [class]="contentClasses()">
        <ng-content></ng-content>
      </div>

      <!-- Card Footer -->
      <div class="flex items-center p-6 pt-0" *ngIf="hasFooter">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [],
})
export class CardComponent {
  @Input() title?: string;
  @Input() clickable = false;
  @Input() padding: 'none' | 'sm' | 'default' | 'lg' = 'default';
  @Input() hasActions = false;
  @Input() hasFooter = false;

  // shadcn/ui inspired card styles
  protected cardClasses = computed(() => {
    const baseClasses =
      'rounded-lg border bg-card text-card-foreground';

    const clickableClasses = this.clickable
      ? 'cursor-pointer transition-colors hover:bg-accent/50'
      : '';

    return `${baseClasses} ${clickableClasses}`;
  });

  protected contentClasses = computed(() => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
    };

    return paddingClasses[this.padding];
  });
}
