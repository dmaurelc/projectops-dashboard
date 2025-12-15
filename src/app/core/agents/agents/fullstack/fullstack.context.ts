import { AgentContext } from '../../models/agent-capability.model';

export const fullstackContext: AgentContext = {
  currentWorkspace: '/Users/danielmc/Desktop/CodeIA/Sesion 8/projectops-dashboard',
  availableServices: [
    'Angular CLI',
    'TypeScript Compiler',
    'ESLint',
    'Prettier',
    'npm/pnpm'
  ],
  environmentVariables: {
    NODE_ENV: 'development',
    ANGULAR_VERSION: '20.0.0',
    TYPESCRIPT_VERSION: '5.8.0',
    PACKAGE_MANAGER: 'pnpm',
    BUILD_OUTPUT: 'dist'
  },
  knowledgeBase: [
    {
      topic: 'Angular 20 Features',
      content: 'Standalone components, Signals for state management, inject() API, zoneless change detection',
      source: 'Angular Documentation',
      relevance: 1.0,
      lastUpdated: new Date()
    },
    {
      topic: 'Project Structure',
      content: 'Features-based architecture with core, shared, and features folders. Lazy-loaded routes.',
      source: 'Project Architecture',
      relevance: 0.95,
      lastUpdated: new Date()
    },
    {
      topic: 'State Management',
      content: 'Using Angular Signals with signal(), computed(), and effect(). No external state library.',
      source: 'codebase',
      relevance: 0.9,
      lastUpdated: new Date()
    }
  ],
  configuration: {
    strictMode: true,
    useStandalone: true,
    useSignals: true,
    lintOnSave: true,
    formatOnSave: true
  }
};
