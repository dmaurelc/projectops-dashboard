import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="flex h-screen w-64 flex-col border-r bg-background">
      <!-- Logo -->
      <div class="flex h-16 items-center gap-2 border-b px-6">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
        <span class="text-lg font-semibold">ProjectOps</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <!-- Management Section -->
        <div class="pb-2">
          <h3 class="mb-2 px-3 text-xs font-medium text-muted-foreground">
            Management
          </h3>
          <div class="space-y-0.5">
            <a
              routerLink="/projects"
              routerLinkActive="bg-secondary text-secondary-foreground"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                />
              </svg>
              <span>Projects</span>
            </a>
            <a
              routerLink="/tasks"
              routerLinkActive="bg-secondary text-secondary-foreground"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 11l3 3L22 4" />
                <path
                  d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                />
              </svg>
              <span>Tasks</span>
            </a>
            <a
              routerLink="/team"
              routerLinkActive="bg-secondary text-secondary-foreground"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Team</span>
            </a>
          </div>
        </div>

        <!-- Analytics Section -->
        <div class="pb-2 pt-4">
          <h3 class="mb-2 px-3 text-xs font-medium text-muted-foreground">
            Analytics
          </h3>
          <div class="space-y-0.5">
            <a
              routerLink="/metrics"
              routerLinkActive="bg-secondary text-secondary-foreground"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Metrics</span>
            </a>
          </div>
        </div>

        <!-- Automation Section -->
        <div class="pb-2 pt-4">
          <h3 class="mb-2 px-3 text-xs font-medium text-muted-foreground">
            Automation
          </h3>
          <div class="space-y-0.5">
            <a
              routerLink="/agents"
              routerLinkActive="bg-secondary text-secondary-foreground"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Agents</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- User Profile -->
      <div class="border-t p-4">
        <div class="flex items-center gap-3">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-black to-slate-500 text-xs font-semibold text-white"
          >
            DM
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="truncate text-sm font-medium">danielmc</p>
            <p class="truncate text-xs text-muted-foreground">me@example.com</p>
          </div>
          <button class="rounded-lg p-1.5 hover:bg-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: [],
})
export class SidebarComponent {}
