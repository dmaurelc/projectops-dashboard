import { ApplicationConfig, provideZonelessChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { apiInterceptor } from '@core/interceptors/api.interceptor';
import { AgentEngineService } from '@core/agents/services/agent-engine.service';

function initializeAgents(agentEngine: AgentEngineService) {
  return () => agentEngine.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAgents,
      deps: [AgentEngineService],
      multi: true
    }
  ]
};
