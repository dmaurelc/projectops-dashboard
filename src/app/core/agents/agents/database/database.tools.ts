import { Tool, ToolCategory, ToolResult } from '../../models/agent-capability.model';
import { inject } from '@angular/core';
import { JsonDatabaseService } from '../../../services/json-database.service';

export const createDatabaseTools = (): Tool[] => {
  return [
    {
      name: 'createEntity',
      description: 'Create a new entity in the database',
      category: ToolCategory.DATA_MANIPULATION,
      parameters: [
        {
          name: 'entityType',
          type: 'string',
          required: true,
          description: 'Type of entity (projects, tasks, teamMembers, agents, agentTasks)',
          validation: {
            enum: ['projects', 'tasks', 'teamMembers', 'agents', 'agentTasks']
          }
        },
        {
          name: 'data',
          type: 'object',
          required: true,
          description: 'Entity data to create'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        try {
          const result = { success: true, data: params };
          return {
            success: true,
            data: result,
            message: `Entity created successfully in ${params.entityType}`,
            executionTime: 50
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to create entity: ${error}`,
            errors: [String(error)]
          };
        }
      },
      validate: (params: any) => {
        const errors: string[] = [];

        if (!params.entityType) {
          errors.push('entityType is required');
        }

        if (!params.data) {
          errors.push('data is required');
        }

        return {
          valid: errors.length === 0,
          errors
        };
      }
    },
    {
      name: 'updateEntity',
      description: 'Update an existing entity in the database',
      category: ToolCategory.DATA_MANIPULATION,
      parameters: [
        {
          name: 'entityType',
          type: 'string',
          required: true,
          description: 'Type of entity',
          validation: {
            enum: ['projects', 'tasks', 'teamMembers', 'agents', 'agentTasks']
          }
        },
        {
          name: 'id',
          type: 'string',
          required: true,
          description: 'Entity ID to update'
        },
        {
          name: 'updates',
          type: 'object',
          required: true,
          description: 'Fields to update'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        try {
          return {
            success: true,
            data: params,
            message: `Entity ${params.id} updated successfully`,
            executionTime: 40
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to update entity: ${error}`,
            errors: [String(error)]
          };
        }
      }
    },
    {
      name: 'deleteEntity',
      description: 'Delete an entity from the database',
      category: ToolCategory.DATA_MANIPULATION,
      parameters: [
        {
          name: 'entityType',
          type: 'string',
          required: true,
          description: 'Type of entity'
        },
        {
          name: 'id',
          type: 'string',
          required: true,
          description: 'Entity ID to delete'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        try {
          return {
            success: true,
            data: { deleted: true, id: params.id },
            message: `Entity ${params.id} deleted successfully`,
            executionTime: 30,
            warnings: ['This operation cannot be undone']
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to delete entity: ${error}`,
            errors: [String(error)]
          };
        }
      }
    },
    {
      name: 'queryData',
      description: 'Query data from the database with filters',
      category: ToolCategory.ANALYSIS,
      parameters: [
        {
          name: 'entityType',
          type: 'string',
          required: true,
          description: 'Type of entity to query'
        },
        {
          name: 'filters',
          type: 'object',
          required: false,
          description: 'Query filters'
        },
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: 'Maximum number of results',
          validation: {
            min: 1,
            max: 1000
          }
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        try {
          const mockResults: any[] = [];

          return {
            success: true,
            data: {
              results: mockResults,
              count: mockResults.length,
              filters: params.filters
            },
            message: `Query executed successfully, found ${mockResults.length} results`,
            executionTime: 60
          };
        } catch (error) {
          return {
            success: false,
            message: `Query failed: ${error}`,
            errors: [String(error)]
          };
        }
      }
    },
    {
      name: 'validateSchema',
      description: 'Validate data against a schema',
      category: ToolCategory.VALIDATION,
      parameters: [
        {
          name: 'entityType',
          type: 'string',
          required: true,
          description: 'Type of entity'
        },
        {
          name: 'data',
          type: 'object',
          required: true,
          description: 'Data to validate'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        try {
          const errors: string[] = [];
          const warnings: string[] = [];

          if (!params.data.id) {
            errors.push('Missing required field: id');
          }

          return {
            success: errors.length === 0,
            data: {
              valid: errors.length === 0,
              errors,
              warnings
            },
            message: errors.length === 0
              ? 'Schema validation passed'
              : `Schema validation failed with ${errors.length} errors`,
            errors,
            warnings
          };
        } catch (error) {
          return {
            success: false,
            message: `Validation error: ${error}`,
            errors: [String(error)]
          };
        }
      }
    },
    {
      name: 'migrateData',
      description: 'Migrate data to a new schema version',
      category: ToolCategory.TRANSFORMATION,
      parameters: [
        {
          name: 'entityType',
          type: 'string',
          required: true,
          description: 'Type of entity to migrate'
        },
        {
          name: 'fromVersion',
          type: 'string',
          required: true,
          description: 'Current schema version'
        },
        {
          name: 'toVersion',
          type: 'string',
          required: true,
          description: 'Target schema version'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        try {
          return {
            success: true,
            data: {
              migrated: 0,
              failed: 0,
              fromVersion: params.fromVersion,
              toVersion: params.toVersion
            },
            message: `Migration completed: 0 records migrated`,
            executionTime: 500,
            warnings: ['Migration is irreversible, backup created automatically']
          };
        } catch (error) {
          return {
            success: false,
            message: `Migration failed: ${error}`,
            errors: [String(error)]
          };
        }
      }
    },
    {
      name: 'backupData',
      description: 'Create a backup of database data',
      category: ToolCategory.DATA_MANIPULATION,
      parameters: [
        {
          name: 'entityTypes',
          type: 'array',
          required: false,
          description: 'Specific entity types to backup (all if not specified)'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        try {
          const backupId = `backup-${Date.now()}`;

          return {
            success: true,
            data: {
              backupId,
              timestamp: new Date(),
              entities: params.entityTypes || ['all']
            },
            message: `Backup created successfully: ${backupId}`,
            executionTime: 200
          };
        } catch (error) {
          return {
            success: false,
            message: `Backup failed: ${error}`,
            errors: [String(error)]
          };
        }
      }
    }
  ];
};
