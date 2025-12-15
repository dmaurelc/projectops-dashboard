import { Skill, SkillLevel, SkillCategory } from '../../models/agent-capability.model';

export const databaseSkills: Skill[] = [
  {
    name: 'JSON Schema Design',
    level: SkillLevel.EXPERT,
    description: 'Design and optimize JSON database schemas for efficient data storage and retrieval',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: []
  },
  {
    name: 'Data Modeling',
    level: SkillLevel.EXPERT,
    description: 'Create robust data models with proper relationships and constraints',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: []
  },
  {
    name: 'CRUD Operations',
    level: SkillLevel.MASTER,
    description: 'Implement efficient Create, Read, Update, Delete operations',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: []
  },
  {
    name: 'Data Migration',
    level: SkillLevel.ADVANCED,
    description: 'Safely migrate data between schema versions without data loss',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: ['JSON Schema Design']
  },
  {
    name: 'Query Optimization',
    level: SkillLevel.ADVANCED,
    description: 'Optimize data queries for maximum performance',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: ['CRUD Operations']
  },
  {
    name: 'Data Validation',
    level: SkillLevel.EXPERT,
    description: 'Validate data integrity and enforce business rules',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: []
  },
  {
    name: 'Relationship Management',
    level: SkillLevel.EXPERT,
    description: 'Manage complex relationships between entities',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: ['Data Modeling']
  },
  {
    name: 'Data Backup & Recovery',
    level: SkillLevel.ADVANCED,
    description: 'Implement backup strategies and recovery procedures',
    category: SkillCategory.DATABASE,
    canTeach: false,
    prerequisites: []
  },
  {
    name: 'Transaction Management',
    level: SkillLevel.ADVANCED,
    description: 'Ensure data consistency with transaction-like operations',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: ['CRUD Operations']
  },
  {
    name: 'Index Optimization',
    level: SkillLevel.INTERMEDIATE,
    description: 'Optimize data structures for fast lookups',
    category: SkillCategory.DATABASE,
    canTeach: true,
    prerequisites: ['Query Optimization']
  }
];
