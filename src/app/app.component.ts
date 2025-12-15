import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/components/layout/header/header.component';
import { SidebarComponent } from '@shared/components/layout/sidebar/sidebar.component';
import { FooterComponent } from '@shared/components/layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container">
      <app-header />
      <div class="app-layout">
        <app-sidebar />
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
      <app-footer />
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-layout {
      display: flex;
      flex: 1;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'ProjectOps Dashboard';
}
