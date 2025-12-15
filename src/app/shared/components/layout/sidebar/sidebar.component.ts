import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <a routerLink="/projects" routerLinkActive="active" class="nav-item">
          <span class="icon">📁</span>
          <span class="label">Projects</span>
        </a>
        <a routerLink="/tasks" routerLinkActive="active" class="nav-item">
          <span class="icon">✓</span>
          <span class="label">Tasks</span>
        </a>
        <a routerLink="/team" routerLinkActive="active" class="nav-item">
          <span class="icon">👥</span>
          <span class="label">Team</span>
        </a>
        <a routerLink="/metrics" routerLinkActive="active" class="nav-item">
          <span class="icon">📊</span>
          <span class="label">Metrics</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #f8f9fa;
      height: calc(100vh - 64px);
      border-right: 1px solid #e0e0e0;
      padding: 1rem 0;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: #333;
      text-decoration: none;
      transition: background-color 0.2s;
    }

    .nav-item:hover {
      background-color: #e9ecef;
    }

    .nav-item.active {
      background-color: #007bff;
      color: white;
    }

    .icon {
      font-size: 1.2rem;
    }

    .label {
      font-size: 1rem;
      font-weight: 500;
    }
  `]
})
export class SidebarComponent {}
