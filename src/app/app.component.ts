import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@shared/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <!-- Sidebar -->
      <app-sidebar />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'ProjectOps Dashboard';
}
