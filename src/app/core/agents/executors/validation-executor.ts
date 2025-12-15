import { AgentTask, TaskResult } from '../models/agent-task.model';

export interface ValidationRule {
  name: string;
  description: string;
  validate: (data: any) => ValidationResult;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  info: ValidationInfo[];
}

export interface ValidationError {
  rule: string;
  message: string;
  location?: string;
  fix?: string;
}

export interface ValidationWarning {
  rule: string;
  message: string;
  location?: string;
  suggestion?: string;
}

export interface ValidationInfo {
  rule: string;
  message: string;
}

export class ValidationExecutor {
  /**
   * Valida el resultado de una tarea
   */
  static async validateTaskResult(
    task: AgentTask,
    result: TaskResult
  ): Promise<ValidationResult> {
    const validationResult: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      info: []
    };

    // Validación básica de estructura
    if (!result.success && !result.message) {
      validationResult.errors.push({
        rule: 'result-structure',
        message: 'Failed task must include an error message',
        fix: 'Add descriptive error message to result'
      });
      validationResult.valid = false;
    }

    // Validar que las tareas completadas tengan datos
    if (result.success && !result.data && task.type !== 'documentation') {
      validationResult.warnings.push({
        rule: 'result-data',
        message: 'Successful task should include result data',
        suggestion: 'Include relevant output data in result'
      });
    }

    // Validar métricas si están presentes
    if (result.metrics) {
      const metricsValidation = this.validateMetrics(result.metrics);
      validationResult.errors.push(...metricsValidation.errors);
      validationResult.warnings.push(...metricsValidation.warnings);

      if (metricsValidation.errors.length > 0) {
        validationResult.valid = false;
      }
    }

    // Validar artefactos si están presentes
    if (result.artifacts && result.artifacts.length > 0) {
      const artifactsValidation = this.validateArtifacts(result.artifacts);
      validationResult.errors.push(...artifactsValidation.errors);
      validationResult.warnings.push(...artifactsValidation.warnings);

      if (artifactsValidation.errors.length > 0) {
        validationResult.valid = false;
      }
    }

    return validationResult;
  }

  /**
   * Valida métricas de tarea
   */
  private static validateMetrics(metrics: any): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      info: []
    };

    // Validar tiempo de ejecución
    if (metrics.executionTime !== undefined) {
      if (metrics.executionTime < 0) {
        result.errors.push({
          rule: 'metrics-execution-time',
          message: 'Execution time cannot be negative',
          fix: 'Set execution time to positive value'
        });
        result.valid = false;
      }

      if (metrics.executionTime > 300000) { // 5 minutos
        result.warnings.push({
          rule: 'metrics-execution-time',
          message: 'Execution time exceeds 5 minutes',
          suggestion: 'Consider optimizing task execution'
        });
      }
    }

    // Validar complejidad
    if (metrics.complexity !== undefined) {
      if (metrics.complexity < 0 || metrics.complexity > 100) {
        result.errors.push({
          rule: 'metrics-complexity',
          message: 'Complexity must be between 0 and 100',
          fix: 'Adjust complexity to valid range'
        });
        result.valid = false;
      }
    }

    // Validar cobertura de tests
    if (metrics.testsCoverage !== undefined) {
      if (metrics.testsCoverage < 0 || metrics.testsCoverage > 100) {
        result.errors.push({
          rule: 'metrics-coverage',
          message: 'Test coverage must be between 0 and 100',
          fix: 'Adjust coverage to valid percentage'
        });
        result.valid = false;
      }

      if (metrics.testsCoverage < 80) {
        result.warnings.push({
          rule: 'metrics-coverage',
          message: 'Test coverage below 80%',
          suggestion: 'Add more tests to improve coverage'
        });
      }
    }

    return result;
  }

  /**
   * Valida artefactos generados
   */
  private static validateArtifacts(artifacts: any[]): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      info: []
    };

    artifacts.forEach((artifact, index) => {
      // Validar que tenga tipo
      if (!artifact.type) {
        result.errors.push({
          rule: 'artifact-type',
          message: `Artifact ${index + 1} missing type`,
          location: `artifacts[${index}]`,
          fix: 'Add type to artifact'
        });
        result.valid = false;
      }

      // Validar que tenga contenido o path
      if (!artifact.content && !artifact.path) {
        result.errors.push({
          rule: 'artifact-content',
          message: `Artifact ${index + 1} has no content or path`,
          location: `artifacts[${index}]`,
          fix: 'Add content or path to artifact'
        });
        result.valid = false;
      }

      // Validar que tenga descripción
      if (!artifact.description) {
        result.warnings.push({
          rule: 'artifact-description',
          message: `Artifact ${index + 1} has no description`,
          location: `artifacts[${index}]`,
          suggestion: 'Add descriptive text for artifact'
        });
      }
    });

    return result;
  }

  /**
   * Valida código generado
   */
  static validateGeneratedCode(code: string, language: string): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      info: []
    };

    // Validaciones generales
    if (!code || code.trim().length === 0) {
      result.errors.push({
        rule: 'code-empty',
        message: 'Generated code is empty',
        fix: 'Generate valid code'
      });
      result.valid = false;
      return result;
    }

    // Validaciones específicas por lenguaje
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'javascript':
        this.validateTypeScript(code, result);
        break;
      case 'html':
        this.validateHTML(code, result);
        break;
      case 'css':
      case 'scss':
        this.validateCSS(code, result);
        break;
    }

    return result;
  }

  private static validateTypeScript(code: string, result: ValidationResult): void {
    // Verificar paréntesis balanceados
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;

    if (openBraces !== closeBraces) {
      result.errors.push({
        rule: 'ts-braces',
        message: 'Unbalanced braces detected',
        fix: 'Ensure all braces are properly closed'
      });
      result.valid = false;
    }

    // Verificar puntos y coma
    const lines = code.split('\n');
    let missingSemicolons = 0;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') &&
          !trimmed.endsWith('}') && !trimmed.startsWith('//')) {
        missingSemicolons++;
      }
    });

    if (missingSemicolons > 0) {
      result.warnings.push({
        rule: 'ts-semicolons',
        message: `${missingSemicolons} lines missing semicolons`,
        suggestion: 'Add semicolons for consistency'
      });
    }
  }

  private static validateHTML(code: string, result: ValidationResult): void {
    // Verificar tags balanceados
    const openTags = code.match(/<(\w+)[^>]*>/g) || [];
    const closeTags = code.match(/<\/(\w+)>/g) || [];

    if (openTags.length !== closeTags.length) {
      result.warnings.push({
        rule: 'html-tags',
        message: 'Potentially unbalanced HTML tags',
        suggestion: 'Verify all tags are properly closed'
      });
    }
  }

  private static validateCSS(code: string, result: ValidationResult): void {
    // Verificar llaves balanceadas
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;

    if (openBraces !== closeBraces) {
      result.errors.push({
        rule: 'css-braces',
        message: 'Unbalanced braces in CSS',
        fix: 'Close all CSS rule blocks'
      });
      result.valid = false;
    }
  }
}
