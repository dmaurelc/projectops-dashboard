import { Agent, AgentType, AgentStatus } from '../../models/agent.model';
import { fullstackSkills } from './fullstack.skills';
import { createFullstackTools } from './fullstack.tools';
import { fullstackContext } from './fullstack.context';
import { fullstackConstraints } from './fullstack.constraints';

export const createFullstackAgent = (): Agent => {
  return {
    id: 'agent-fullstack-001',
    type: AgentType.FULLSTACK,
    name: 'Fullstack Developer Agent',
    description: 'Full-stack development agent specializing in Angular, TypeScript, and modern web development. Handles feature implementation, code generation, refactoring, and architecture design.',
    status: AgentStatus.IDLE,
    skills: fullstackSkills,
    tools: createFullstackTools(),
    context: fullstackContext,
    constraints: fullstackConstraints,
    tasksCompleted: 0,
    tasksInQueue: 0,
    successRate: 100,
    createdAt: new Date()
  };
};
