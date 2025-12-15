import { Skill, SkillLevel, SkillCategory } from '../../models/agent-capability.model';

export const fullstackSkills: Skill[] = [
  {
    name: 'Angular Development',
    level: SkillLevel.EXPERT,
    description: 'Build modern Angular applications with latest features and best practices',
    category: SkillCategory.PROGRAMMING,
    canTeach: true,
    prerequisites: []
  },
  {
    name: 'TypeScript Programming',
    level: SkillLevel.MASTER,
    description: 'Expert-level TypeScript with advanced types and patterns',
    category: SkillCategory.PROGRAMMING,
    canTeach: true,
    prerequisites: []
  },
  {
    name: 'Signal State Management',
    level: SkillLevel.EXPERT,
    description: 'Modern reactive state management using Angular Signals',
    category: SkillCategory.PROGRAMMING,
    canTeach: true,
    prerequisites: ['Angular Development']
  },
  {
    name: 'Reactive Programming (RxJS)',
    level: SkillLevel.ADVANCED,
    description: 'Asynchronous programming with RxJS operators and patterns',
    category: SkillCategory.PROGRAMMING,
    canTeach: true,
    prerequisites: ['TypeScript Programming']
  },
  {
    name: 'Component Architecture',
    level: SkillLevel.EXPERT,
    description: 'Design scalable component hierarchies and reusable components',
    category: SkillCategory.ARCHITECTURE,
    canTeach: true,
    prerequisites: ['Angular Development']
  },
  {
    name: 'Service Layer Design',
    level: SkillLevel.EXPERT,
    description: 'Create maintainable service architectures with dependency injection',
    category: SkillCategory.ARCHITECTURE,
    canTeach: true,
    prerequisites: ['Angular Development']
  },
  {
    name: 'HTTP Client Integration',
    level: SkillLevel.ADVANCED,
    description: 'Implement RESTful API communication with interceptors',
    category: SkillCategory.PROGRAMMING,
    canTeach: true,
    prerequisites: ['Reactive Programming (RxJS)']
  },
  {
    name: 'Routing & Navigation',
    level: SkillLevel.ADVANCED,
    description: 'Implement complex routing with lazy loading and guards',
    category: SkillCategory.PROGRAMMING,
    canTeach: true,
    prerequisites: ['Angular Development']
  },
  {
    name: 'Form Handling',
    level: SkillLevel.EXPERT,
    description: 'Build reactive and template-driven forms with validation',
    category: SkillCategory.PROGRAMMING,
    canTeach: true,
    prerequisites: ['Angular Development']
  },
  {
    name: 'Code Refactoring',
    level: SkillLevel.ADVANCED,
    description: 'Improve code quality through systematic refactoring',
    category: SkillCategory.PROGRAMMING,
    canTeach: true,
    prerequisites: ['TypeScript Programming']
  }
];
