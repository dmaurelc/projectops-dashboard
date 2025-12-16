import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-col items-center justify-center gap-3 p-8"
      [class.fixed]="fullscreen"
      [class.inset-0]="fullscreen"
      [class.bg-background/80]="fullscreen"
      [class.backdrop-blur-sm]="fullscreen"
      [class.z-50]="fullscreen"
    >
      <div
        class="animate-spin rounded-full border-2 border-muted border-t-primary"
        [class.h-6]="size === 'sm'"
        [class.w-6]="size === 'sm'"
        [class.h-10]="size === 'md'"
        [class.w-10]="size === 'md'"
        [class.h-12]="size === 'lg'"
        [class.w-12]="size === 'lg'"
      ></div>
      <p *ngIf="message" class="text-sm text-muted-foreground">{{ message }}</p>
    </div>
  `,
  styles: []
})
export class LoaderComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message = '';
  @Input() fullscreen = false;
}
