import { AgentConstraints } from '../../models/agent-capability.model';

export const databaseConstraints: AgentConstraints = {
  maxConcurrentTasks: 3,
  maxQueueSize: 20,

  allowedOperations: [
    'create',
    'read',
    'update',
    'delete',
    'query',
    'validate',
    'backup',
    'migrate',
    'export',
    'import',
    'analyze'
  ],

  forbiddenOperations: [
    'dropDatabase',
    'truncateAll',
    'disableValidation',
    'bypassConstraints',
    'modifySchema',
    'alterSystemTables'
  ],

  requiresApproval: [
    'delete',
    'migrate',
    'bulkDelete',
    'massUpdate',
    'dropCollection',
    'restoreBackup',
    'executeRawQuery'
  ],

  timeout: 30000,

  rateLimits: [
    {
      operation: 'create',
      maxRequests: 100,
      windowMs: 60000
    },
    {
      operation: 'update',
      maxRequests: 200,
      windowMs: 60000
    },
    {
      operation: 'delete',
      maxRequests: 50,
      windowMs: 60000
    },
    {
      operation: 'query',
      maxRequests: 500,
      windowMs: 60000
    },
    {
      operation: 'backup',
      maxRequests: 10,
      windowMs: 3600000
    },
    {
      operation: 'migrate',
      maxRequests: 5,
      windowMs: 3600000
    }
  ],

  resourceLimits: {
    maxMemoryMB: 512,
    maxCpuPercent: 50,
    maxDiskSpaceMB: 100,
    maxNetworkKbps: 5000
  }
};
