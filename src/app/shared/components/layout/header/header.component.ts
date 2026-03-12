import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { JsonDatabaseService } from '@core/services/json-database.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-30 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 shadow-lg backdrop-blur-sm"
    >
      <div class="container-custom">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md"
            >
              <span class="text-2xl">📊</span>
            </div>
            <div class="text-2xl font-bold text-white tracking-tight">
              ProjectOps
            </div>
          </div>

          <!-- Navigation (Desktop) -->
          <nav class="hidden md:flex items-center space-x-1">
            <a
              routerLink="/projects"
              routerLinkActive="bg-white/20 shadow-sm"
              [routerLinkActiveOptions]="{ exact: false }"
              class="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              Projects
            </a>
            <a
              routerLink="/tasks"
              routerLinkActive="bg-white/20 shadow-sm"
              class="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              Tasks
            </a>
            <a
              routerLink="/team"
              routerLinkActive="bg-white/20 shadow-sm"
              class="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              Team
            </a>
            <a
              routerLink="/metrics"
              routerLinkActive="bg-white/20 shadow-sm"
              class="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              Metrics
            </a>
            <a
              routerLink="/agents"
              routerLinkActive="bg-white/20 shadow-sm"
              class="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 backdrop-blur-sm flex items-center gap-2"
            >
              <span>🤖</span>
              <span>AI Agents</span>
            </a>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Export Button -->
            <button
              (click)="exportDatabase()"
              class="relative p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              title="Export Database (Download JSON)"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>

            <!-- Reset Button -->
            <button
              (click)="resetDatabase()"
              class="relative p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset Database"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            <!-- Notification Bell -->
            <button
              class="relative p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
              ></span>
            </button>

            <!-- User Avatar -->
            <div
              class="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer"
            >
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-semibold text-sm"
              >
                U
              </div>
              <span class="hidden lg:block text-white font-medium text-sm"
                >User</span
              >
              <svg
                class="w-4 h-4 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  private db = inject(JsonDatabaseService);

  async resetDatabase(): Promise<void> {
    if (
      confirm(
        '¿Estás seguro de que deseas recargar los datos originales desde database.json? Esto descartará todos los cambios almacenados en localStorage.'
      )
    ) {
      try {
        await this.db.reset();
        alert(
          'Datos recargados exitosamente desde database.json. La página se recargará.'
        );
        window.location.reload();
      } catch (error) {
        console.error('Error resetting database:', error);
        alert('Error al recargar los datos.');
      }
    }
  }

  exportDatabase(): void {
    try {
      this.db.exportDatabase();
      alert(
        'Base de datos exportada exitosamente. Puedes reemplazar src/assets/database.json con el archivo descargado.'
      );
    } catch (error) {
      console.error('Error exporting database:', error);
      alert('Error al exportar la base de datos.');
    }
  }
}
