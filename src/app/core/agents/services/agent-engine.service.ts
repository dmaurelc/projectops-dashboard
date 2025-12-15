import { Injectable, inject, signal } from '@angular/core';
import { AgentRegistryService } from './agent-registry.service';
import { TaskQueueService } from './task-queue.service';
import { MetaAgentService } from './meta-agent.service';
import { AgentLoggerService, LogCategory } from './agent-logger.service';
import { createDatabaseAgent } from '../agents/database/database-agent';
import { createFullstackAgent } from '../agents/fullstack/fullstack-agent';
import { Agent, AgentType, AgentStatus } from '../models/agent.model';
import { Skill, SkillLevel, SkillCategory, Tool, ToolCategory, AgentContext, AgentConstraints } from '../models/agent-capability.model';

@Injectable({
  providedIn: 'root'
})
export class AgentEngineService {
  private registry = inject(AgentRegistryService);
  private taskQueue = inject(TaskQueueService);
  private metaAgent = inject(MetaAgentService);
  private logger = inject(AgentLoggerService);

  private initializedState = signal<boolean>(false);

  readonly initialized = this.initializedState.asReadonly();

  async initialize(): Promise<void> {
    if (this.initializedState()) {
      console.log('Agent engine already initialized');
      return;
    }

    this.logger.info('system', LogCategory.SYSTEM, 'Initializing agent engine');

    try {
      const databaseAgent = createDatabaseAgent();
      this.registry.registerAgent(databaseAgent);
      this.logger.info('system', LogCategory.AGENT_LIFECYCLE, `Registered ${databaseAgent.name}`);

      const fullstackAgent = createFullstackAgent();
      this.registry.registerAgent(fullstackAgent);
      this.logger.info('system', LogCategory.AGENT_LIFECYCLE, `Registered ${fullstackAgent.name}`);

      const testerAgent = this.createTesterAgent();
      this.registry.registerAgent(testerAgent);
      this.logger.info('system', LogCategory.AGENT_LIFECYCLE, `Registered ${testerAgent.name}`);

      const uiUxAgent = this.createUIUXAgent();
      this.registry.registerAgent(uiUxAgent);
      this.logger.info('system', LogCategory.AGENT_LIFECYCLE, `Registered ${uiUxAgent.name}`);

      const securityAgent = this.createSecurityAgent();
      this.registry.registerAgent(securityAgent);
      this.logger.info('system', LogCategory.AGENT_LIFECYCLE, `Registered ${securityAgent.name}`);

      const optimizationAgent = this.createOptimizationAgent();
      this.registry.registerAgent(optimizationAgent);
      this.logger.info('system', LogCategory.AGENT_LIFECYCLE, `Registered ${optimizationAgent.name}`);

      const documentationAgent = this.createDocumentationAgent();
      this.registry.registerAgent(documentationAgent);
      this.logger.info('system', LogCategory.AGENT_LIFECYCLE, `Registered ${documentationAgent.name}`);

      this.initializedState.set(true);
      this.logger.info('system', LogCategory.SYSTEM, 'Agent engine initialized successfully with 7 agents');
    } catch (error) {
      this.logger.error('system', LogCategory.SYSTEM, 'Failed to initialize agent engine', error);
      throw error;
    }
  }

  private createTesterAgent(): Agent {
    const skills: Skill[] = [
      { name: 'Unit Testing', level: SkillLevel.EXPERT, description: 'Create comprehensive unit tests', category: SkillCategory.TESTING, canTeach: true },
      { name: 'Integration Testing', level: SkillLevel.ADVANCED, description: 'Test component interactions', category: SkillCategory.TESTING, canTeach: true },
      { name: 'E2E Testing', level: SkillLevel.ADVANCED, description: 'End-to-end testing workflows', category: SkillCategory.TESTING, canTeach: true },
      { name: 'Test Coverage Analysis', level: SkillLevel.EXPERT, description: 'Analyze and improve test coverage', category: SkillCategory.TESTING, canTeach: true },
      { name: 'Bug Detection', level: SkillLevel.EXPERT, description: 'Identify and report bugs', category: SkillCategory.TESTING, canTeach: false }
    ];

    const tools: Tool[] = [
      {
        name: 'generateUnitTests',
        description: 'Generate unit tests for components and services',
        category: ToolCategory.CODE_GENERATION,
        execute: async (params) => ({ success: true, message: 'Unit tests generated' })
      },
      {
        name: 'runTests',
        description: 'Execute test suite',
        category: ToolCategory.VALIDATION,
        execute: async (params) => ({ success: true, message: 'Tests executed successfully' })
      },
      {
        name: 'analyzeCoverage',
        description: 'Analyze test coverage',
        category: ToolCategory.ANALYSIS,
        execute: async (params) => ({ success: true, data: { coverage: 85 } })
      }
    ];

    const context: AgentContext = {
      currentWorkspace: '/Users/danielmc/Desktop/CodeIA/Sesion 8/projectops-dashboard',
      availableServices: ['Jasmine', 'Karma', 'Jest'],
      environmentVariables: { TEST_FRAMEWORK: 'Jasmine' },
      knowledgeBase: [],
      configuration: { strictMode: true }
    };

    const constraints: AgentConstraints = {
      maxConcurrentTasks: 2,
      maxQueueSize: 10,
      allowedOperations: ['test', 'analyze', 'generate'],
      forbiddenOperations: ['modifyProduction'],
      requiresApproval: [],
      timeout: 120000,
      rateLimits: [],
      resourceLimits: { maxMemoryMB: 512, maxCpuPercent: 50, maxDiskSpaceMB: 200, maxNetworkKbps: 5000 }
    };

    return {
      id: 'agent-tester-001',
      type: AgentType.TESTER,
      name: 'Tester Agent',
      description: 'Automated testing specialist for unit, integration, and E2E tests',
      status: AgentStatus.IDLE,
      skills,
      tools,
      context,
      constraints,
      tasksCompleted: 0,
      tasksInQueue: 0,
      successRate: 100,
      createdAt: new Date()
    };
  }

  private createUIUXAgent(): Agent {
    const skills: Skill[] = [
      { name: 'Component Design', level: SkillLevel.EXPERT, description: 'Design beautiful UI components', category: SkillCategory.DESIGN, canTeach: true },
      { name: 'Responsive Layouts', level: SkillLevel.EXPERT, description: 'Create responsive designs', category: SkillCategory.DESIGN, canTeach: true },
      { name: 'Accessibility', level: SkillLevel.ADVANCED, description: 'WCAG 2.1 compliance', category: SkillCategory.DESIGN, canTeach: true },
      { name: 'User Experience', level: SkillLevel.EXPERT, description: 'Optimize user flows', category: SkillCategory.DESIGN, canTeach: true }
    ];

    const tools: Tool[] = [
      {
        name: 'generateComponent',
        description: 'Create UI component with styling',
        category: ToolCategory.CODE_GENERATION,
        execute: async (params) => ({ success: true, message: 'Component created' })
      },
      {
        name: 'validateAccessibility',
        description: 'Check accessibility compliance',
        category: ToolCategory.VALIDATION,
        execute: async (params) => ({ success: true, data: { score: 95 } })
      }
    ];

    const context: AgentContext = {
      currentWorkspace: '/Users/danielmc/Desktop/CodeIA/Sesion 8/projectops-dashboard',
      availableServices: ['CSS', 'SCSS', 'Tailwind'],
      environmentVariables: {},
      knowledgeBase: [],
      configuration: {}
    };

    const constraints: AgentConstraints = {
      maxConcurrentTasks: 3,
      maxQueueSize: 15,
      allowedOperations: ['design', 'style', 'validate'],
      forbiddenOperations: [],
      requiresApproval: ['themeChange'],
      timeout: 45000,
      rateLimits: [],
      resourceLimits: { maxMemoryMB: 512, maxCpuPercent: 40, maxDiskSpaceMB: 300, maxNetworkKbps: 5000 }
    };

    return {
      id: 'agent-uiux-001',
      type: AgentType.UI_UX,
      name: 'UI/UX Agent',
      description: 'UI/UX design specialist for beautiful and accessible interfaces',
      status: AgentStatus.IDLE,
      skills,
      tools,
      context,
      constraints,
      tasksCompleted: 0,
      tasksInQueue: 0,
      successRate: 100,
      createdAt: new Date()
    };
  }

  private createSecurityAgent(): Agent {
    const skills: Skill[] = [
      { name: 'Vulnerability Scanning', level: SkillLevel.EXPERT, description: 'Scan for security vulnerabilities', category: SkillCategory.SECURITY, canTeach: true },
      { name: 'XSS Prevention', level: SkillLevel.EXPERT, description: 'Prevent cross-site scripting', category: SkillCategory.SECURITY, canTeach: true },
      { name: 'CSRF Protection', level: SkillLevel.ADVANCED, description: 'Implement CSRF protection', category: SkillCategory.SECURITY, canTeach: true },
      { name: 'OWASP Compliance', level: SkillLevel.EXPERT, description: 'Follow OWASP guidelines', category: SkillCategory.SECURITY, canTeach: true }
    ];

    const tools: Tool[] = [
      {
        name: 'scanVulnerabilities',
        description: 'Scan code for vulnerabilities',
        category: ToolCategory.ANALYSIS,
        execute: async (params) => ({ success: true, data: { vulnerabilities: [] } })
      },
      {
        name: 'auditDependencies',
        description: 'Audit npm dependencies',
        category: ToolCategory.ANALYSIS,
        execute: async (params) => ({ success: true, data: { issues: 0 } })
      }
    ];

    const context: AgentContext = {
      currentWorkspace: '/Users/danielmc/Desktop/CodeIA/Sesion 8/projectops-dashboard',
      availableServices: ['npm audit', 'ESLint Security'],
      environmentVariables: {},
      knowledgeBase: [],
      configuration: {}
    };

    const constraints: AgentConstraints = {
      maxConcurrentTasks: 2,
      maxQueueSize: 10,
      allowedOperations: ['scan', 'audit', 'report'],
      forbiddenOperations: ['disableSecurity'],
      requiresApproval: ['securityFix'],
      timeout: 60000,
      rateLimits: [],
      resourceLimits: { maxMemoryMB: 512, maxCpuPercent: 60, maxDiskSpaceMB: 200, maxNetworkKbps: 5000 }
    };

    return {
      id: 'agent-security-001',
      type: AgentType.SECURITY,
      name: 'Security Agent',
      description: 'Security specialist for vulnerability scanning and OWASP compliance',
      status: AgentStatus.IDLE,
      skills,
      tools,
      context,
      constraints,
      tasksCompleted: 0,
      tasksInQueue: 0,
      successRate: 100,
      createdAt: new Date()
    };
  }

  private createOptimizationAgent(): Agent {
    const skills: Skill[] = [
      { name: 'Performance Profiling', level: SkillLevel.EXPERT, description: 'Profile application performance', category: SkillCategory.OPTIMIZATION, canTeach: true },
      { name: 'Bundle Optimization', level: SkillLevel.ADVANCED, description: 'Optimize bundle size', category: SkillCategory.OPTIMIZATION, canTeach: true },
      { name: 'Memory Management', level: SkillLevel.ADVANCED, description: 'Detect and fix memory leaks', category: SkillCategory.OPTIMIZATION, canTeach: true }
    ];

    const tools: Tool[] = [
      {
        name: 'analyzePerformance',
        description: 'Analyze application performance',
        category: ToolCategory.ANALYSIS,
        execute: async (params) => ({ success: true, data: { score: 90 } })
      },
      {
        name: 'optimizeBundle',
        description: 'Optimize build bundle',
        category: ToolCategory.TRANSFORMATION,
        execute: async (params) => ({ success: true, message: 'Bundle optimized' })
      }
    ];

    const context: AgentContext = {
      currentWorkspace: '/Users/danielmc/Desktop/CodeIA/Sesion 8/projectops-dashboard',
      availableServices: ['Webpack', 'Lighthouse'],
      environmentVariables: {},
      knowledgeBase: [],
      configuration: {}
    };

    const constraints: AgentConstraints = {
      maxConcurrentTasks: 2,
      maxQueueSize: 10,
      allowedOperations: ['analyze', 'optimize', 'profile'],
      forbiddenOperations: ['breakFunctionality'],
      requiresApproval: ['majorOptimization'],
      timeout: 90000,
      rateLimits: [],
      resourceLimits: { maxMemoryMB: 1024, maxCpuPercent: 80, maxDiskSpaceMB: 500, maxNetworkKbps: 10000 }
    };

    return {
      id: 'agent-optimization-001',
      type: AgentType.OPTIMIZATION,
      name: 'Optimization Agent',
      description: 'Performance optimization specialist for speed and efficiency',
      status: AgentStatus.IDLE,
      skills,
      tools,
      context,
      constraints,
      tasksCompleted: 0,
      tasksInQueue: 0,
      successRate: 100,
      createdAt: new Date()
    };
  }

  private createDocumentationAgent(): Agent {
    const skills: Skill[] = [
      { name: 'Technical Writing', level: SkillLevel.EXPERT, description: 'Write clear technical documentation', category: SkillCategory.DOCUMENTATION, canTeach: true },
      { name: 'API Documentation', level: SkillLevel.ADVANCED, description: 'Document APIs comprehensively', category: SkillCategory.DOCUMENTATION, canTeach: true },
      { name: 'Markdown Generation', level: SkillLevel.EXPERT, description: 'Generate markdown docs', category: SkillCategory.DOCUMENTATION, canTeach: true }
    ];

    const tools: Tool[] = [
      {
        name: 'generateDocs',
        description: 'Generate documentation from code',
        category: ToolCategory.CODE_GENERATION,
        execute: async (params) => ({ success: true, message: 'Documentation generated' })
      },
      {
        name: 'updateReadme',
        description: 'Update README file',
        category: ToolCategory.CODE_GENERATION,
        execute: async (params) => ({ success: true, message: 'README updated' })
      }
    ];

    const context: AgentContext = {
      currentWorkspace: '/Users/danielmc/Desktop/CodeIA/Sesion 8/projectops-dashboard',
      availableServices: ['TypeDoc', 'JSDoc'],
      environmentVariables: {},
      knowledgeBase: [],
      configuration: {}
    };

    const constraints: AgentConstraints = {
      maxConcurrentTasks: 2,
      maxQueueSize: 15,
      allowedOperations: ['generate', 'update', 'create'],
      forbiddenOperations: ['modifyCode'],
      requiresApproval: [],
      timeout: 45000,
      rateLimits: [],
      resourceLimits: { maxMemoryMB: 256, maxCpuPercent: 30, maxDiskSpaceMB: 200, maxNetworkKbps: 2000 }
    };

    return {
      id: 'agent-documentation-001',
      type: AgentType.DOCUMENTATION,
      name: 'Documentation Agent',
      description: 'Documentation specialist for comprehensive project documentation',
      status: AgentStatus.IDLE,
      skills,
      tools,
      context,
      constraints,
      tasksCompleted: 0,
      tasksInQueue: 0,
      successRate: 100,
      createdAt: new Date()
    };
  }

  getRegisteredAgents() {
    return this.registry.agents();
  }

  getAgentMetrics() {
    return this.registry.getAllMetrics();
  }
}
