import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>ProjectOps</h1>
        </div>
        <nav class="nav">
          <a routerLink="/projects" routerLinkActive="active">Projects</a>
          <a routerLink="/tasks" routerLinkActive="active">Tasks</a>
          <a routerLink="/team" routerLinkActive="active">Team</a>
          <a routerLink="/metrics" routerLinkActive="active">Metrics</a>
          <a routerLink="/agents" routerLinkActive="active">AI Agents</a>
        </nav>
        <div class="user-menu">
          <span class="user-name">User</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #1a1a2e;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .nav {
      display: flex;
      gap: 2rem;
    }

    .nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav a:hover,
    .nav a.active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      font-size: 0.9rem;
    }
  `]
})
export class HeaderComponent {}
