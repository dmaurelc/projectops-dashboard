import { AgentConstraints } from '../../models/agent-capability.model';

export const fullstackConstraints: AgentConstraints = {
  maxConcurrentTasks: 2,
  maxQueueSize: 15,
  allowedOperations: [
    'createComponent',
    'createService',
    'createPipe',
    'createGuard',
    'createInterceptor',
    'refactor',
    'optimize',
    'addRoute',
    'addDependency',
    'codeReview'
  ],
  forbiddenOperations: [
    'deleteCore',
    'modifyBuildConfig',
    'removeEssentialDependencies',
    'disableSecurity'
  ],
  requiresApproval: [
    'majorRefactoring',
    'architecturalChange',
    'breaking changes',
    'dependencyUpgrade'
  ],
  timeout: 60000,
  rateLimits: [
    { operation: 'createComponent', maxRequests: 50, windowMs: 60000 },
    { operation: 'createService', maxRequests: 30, windowMs: 60000 },
    { operation: 'refactor', maxRequests: 20, windowMs: 60000 }
  ],
  resourceLimits: {
    maxMemoryMB: 1024,
    maxCpuPercent: 70,
    maxDiskSpaceMB: 500,
    maxNetworkKbps: 10000
  }
};
