export interface Skill {
  name: string;
  level: SkillLevel;
  description: string;
  category: SkillCategory;
  canTeach: boolean;
  prerequisites?: string[];
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  MASTER = 'master'
}

export enum SkillCategory {
  PROGRAMMING = 'programming',
  DATABASE = 'database',
  DESIGN = 'design',
  TESTING = 'testing',
  SECURITY = 'security',
  OPTIMIZATION = 'optimization',
  DOCUMENTATION = 'documentation',
  ARCHITECTURE = 'architecture',
  DEVOPS = 'devops'
}

export interface Tool {
  name: string;
  description: string;
  category: ToolCategory;
  version?: string;
  parameters?: ToolParameter[];
  execute: (params: any) => Promise<ToolResult>;
  validate?: (params: any) => ToolValidationResult;
}

export enum ToolCategory {
  CODE_GENERATION = 'code_generation',
  DATA_MANIPULATION = 'data_manipulation',
  ANALYSIS = 'analysis',
  VALIDATION = 'validation',
  TRANSFORMATION = 'transformation',
  DEPLOYMENT = 'deployment',
  MONITORING = 'monitoring'
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
  custom?: (value: any) => boolean;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  message?: string;
  executionTime?: number;
  warnings?: string[];
  errors?: string[];
}

export interface ToolValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface AgentContext {
  projectId?: string;
  currentWorkspace: string;
  availableServices: string[];
  environmentVariables: Record<string, string>;
  knowledgeBase: KnowledgeBaseEntry[];
  configuration: Record<string, any>;
}

export interface KnowledgeBaseEntry {
  topic: string;
  content: string;
  source: string;
  relevance: number;
  lastUpdated: Date;
}

export interface AgentConstraints {
  maxConcurrentTasks: number;
  maxQueueSize: number;
  allowedOperations: string[];
  forbiddenOperations: string[];
  requiresApproval: string[];
  timeout: number;
  rateLimits: RateLimit[];
  resourceLimits: ResourceLimit;
}

export interface RateLimit {
  operation: string;
  maxRequests: number;
  windowMs: number;
}

export interface ResourceLimit {
  maxMemoryMB: number;
  maxCpuPercent: number;
  maxDiskSpaceMB: number;
  maxNetworkKbps: number;
}
