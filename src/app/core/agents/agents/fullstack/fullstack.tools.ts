import { Tool, ToolCategory, ToolResult } from '../../models/agent-capability.model';

export const createFullstackTools = (): Tool[] => {
  return [
    {
      name: 'createService',
      description: 'Create a new Angular service with dependency injection',
      category: ToolCategory.CODE_GENERATION,
      parameters: [
        {
          name: 'serviceName',
          type: 'string',
          required: true,
          description: 'Name of the service (e.g., "UserService")'
        },
        {
          name: 'providedIn',
          type: 'string',
          required: false,
          description: 'Injection scope ("root", "platform", "any")',
          defaultValue: 'root'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        const code = `
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: '${params.providedIn || 'root'}' })
export class ${params.serviceName} {
  private dataState = signal<any[]>([]);
  readonly data = this.dataState.asReadonly();

  async loadData(): Promise<void> {
    // TODO: Implement data loading logic
  }
}
        `.trim();

        return {
          success: true,
          data: { code, fileName: `${params.serviceName.toLowerCase()}.service.ts` },
          message: `Service ${params.serviceName} created successfully`,
          executionTime: 100
        };
      }
    },
    {
      name: 'createComponent',
      description: 'Create a new standalone Angular component',
      category: ToolCategory.CODE_GENERATION,
      parameters: [
        {
          name: 'componentName',
          type: 'string',
          required: true,
          description: 'Name of the component (e.g., "UserCard")'
        },
        {
          name: 'selector',
          type: 'string',
          required: true,
          description: 'Component selector (e.g., "app-user-card")'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        const code = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '${params.selector}',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="${params.componentName.toLowerCase()}">
      <p>${params.componentName} works!</p>
    </div>
  \`,
  styles: [\`
    .${params.componentName.toLowerCase()} {
      padding: 1rem;
    }
  \`]
})
export class ${params.componentName}Component {
  // Component logic here
}
        `.trim();

        return {
          success: true,
          data: { code, fileName: `${params.componentName.toLowerCase()}.component.ts` },
          message: `Component ${params.componentName} created successfully`,
          executionTime: 120
        };
      }
    },
    {
      name: 'implementFeature',
      description: 'Implement a complete feature with routes, components, and services',
      category: ToolCategory.CODE_GENERATION,
      parameters: [
        {
          name: 'featureName',
          type: 'string',
          required: true,
          description: 'Name of the feature'
        },
        {
          name: 'includeService',
          type: 'boolean',
          required: false,
          description: 'Include a service for the feature',
          defaultValue: true
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        const artifacts = [];

        artifacts.push({
          type: 'file',
          path: `src/app/features/${params.featureName}/${params.featureName}.routes.ts`,
          description: 'Feature routing configuration'
        });

        if (params.includeService) {
          artifacts.push({
            type: 'file',
            path: `src/app/features/${params.featureName}/services/${params.featureName}.service.ts`,
            description: 'Feature service'
          });
        }

        return {
          success: true,
          data: { artifacts, featureName: params.featureName },
          message: `Feature ${params.featureName} implemented with ${artifacts.length} files`,
          executionTime: 500
        };
      }
    },
    {
      name: 'refactorCode',
      description: 'Refactor existing code to improve quality',
      category: ToolCategory.TRANSFORMATION,
      parameters: [
        {
          name: 'filePath',
          type: 'string',
          required: true,
          description: 'Path to file to refactor'
        },
        {
          name: 'refactoringType',
          type: 'string',
          required: true,
          description: 'Type of refactoring',
          validation: {
            enum: ['extract-method', 'rename', 'move', 'inline', 'optimize']
          }
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            originalFile: params.filePath,
            refactoringType: params.refactoringType,
            changes: []
          },
          message: `Refactoring ${params.refactoringType} applied to ${params.filePath}`,
          executionTime: 300
        };
      }
    },
    {
      name: 'addDependency',
      description: 'Add npm dependency to project',
      category: ToolCategory.DEPLOYMENT,
      parameters: [
        {
          name: 'packageName',
          type: 'string',
          required: true,
          description: 'NPM package name'
        },
        {
          name: 'version',
          type: 'string',
          required: false,
          description: 'Package version',
          defaultValue: 'latest'
        }
      ],
      execute: async (params: any): Promise<ToolResult> => {
        return {
          success: true,
          data: {
            package: params.packageName,
            version: params.version || 'latest'
          },
          message: `Added ${params.packageName}@${params.version || 'latest'} to dependencies`,
          executionTime: 2000
        };
      }
    }
  ];
};
