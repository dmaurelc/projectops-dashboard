import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { TeamMember } from '../models/team-member.model';
import { Agent } from '../agents/models/agent.model';
import { AgentTask } from '../agents/models/agent-task.model';
import { AgentCommunicationLog } from '../agents/models/agent-message.model';

export interface DatabaseSchema {
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
  agents?: Agent[];
  agentTasks?: AgentTask[];
  agentLogs?: AgentCommunicationLog[];
}

/**
 * Servicio de base de datos JSON
 *
 * IMPORTANTE: Debido a restricciones de seguridad del navegador, no es posible
 * escribir directamente en archivos del sistema desde JavaScript.
 *
 * Estrategia de persistencia:
 * - Los datos se cargan desde assets/database.json al inicializar
 * - Los cambios se guardan en localStorage para persistencia entre sesiones
 * - Use el método exportDatabase() para descargar el estado actual como JSON
 * - Para backend real, necesitarías implementar un servidor Node.js/Express
 */
@Injectable({
  providedIn: 'root',
})
export class JsonDatabaseService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'projectops_database';
  private readonly DATABASE_FILE = 'assets/database.json';
  private database: DatabaseSchema | null = null;
  private initialized = false;

  /**
   * Inicializa la base de datos cargando datos desde el archivo JSON
   * Los cambios se mantienen solo en memoria durante la sesión
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Cargar siempre desde el archivo JSON
      const data = await firstValueFrom(
        this.http.get<DatabaseSchema>(this.DATABASE_FILE)
      );
      if (data) {
        this.database = data;
        this.parseDates(this.database);
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to initialize database');
    }
  }

  /**
   * Convierte strings de fecha a objetos Date
   */
  private parseDates(db: DatabaseSchema): void {
    // Convertir fechas de proyectos
    db.projects.forEach((project) => {
      project.startDate = new Date(project.startDate);
      if (project.endDate) {
        project.endDate = new Date(project.endDate);
      }
      project.createdAt = new Date(project.createdAt);
      project.updatedAt = new Date(project.updatedAt);
    });

    // Convertir fechas de tareas
    db.tasks.forEach((task) => {
      if (task.dueDate) {
        task.dueDate = new Date(task.dueDate);
      }
      task.createdAt = new Date(task.createdAt);
      task.updatedAt = new Date(task.updatedAt);
    });

    // Convertir fechas de miembros del equipo
    db.teamMembers.forEach((member) => {
      member.joinedDate = new Date(member.joinedDate);
    });
  }

  /**
   * Guarda la base de datos en localStorage
   */
  private save(): void {
    if (this.database) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.database));
      console.log('💾 Database saved to localStorage');
    }
  }

  /**
   * Obtiene todos los proyectos
   */
  async getProjects(): Promise<Project[]> {
    await this.initialize();
    return [...(this.database?.projects || [])];
  }

  /**
   * Obtiene un proyecto por ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    await this.initialize();
    return this.database?.projects.find((p) => p.id === id) || null;
  }

  /**
   * Crea un nuevo proyecto
   */
  async createProject(project: Project): Promise<Project> {
    await this.initialize();
    this.database!.projects.push(project);
    this.save();
    return project;
  }

  /**
   * Actualiza un proyecto existente
   */
  async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<Project | null> {
    await this.initialize();
    const index = this.database!.projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return null;
    }

    this.database!.projects[index] = {
      ...this.database!.projects[index],
      ...updates,
      id, // Asegurar que el ID no cambie
      updatedAt: new Date(),
    };

    this.save();
    return this.database!.projects[index];
  }

  /**
   * Elimina un proyecto
   */
  async deleteProject(id: string): Promise<boolean> {
    await this.initialize();
    const initialLength = this.database!.projects.length;
    this.database!.projects = this.database!.projects.filter(
      (p) => p.id !== id
    );

    if (this.database!.projects.length < initialLength) {
      this.save();
      return true;
    }

    return false;
  }

  /**
   * Obtiene todas las tareas
   */
  async getTasks(): Promise<Task[]> {
    await this.initialize();
    return [...(this.database?.tasks || [])];
  }

  /**
   * Obtiene una tarea por ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    await this.initialize();
    return this.database?.tasks.find((t) => t.id === id) || null;
  }

  /**
   * Obtiene tareas por proyecto
   */
  async getTasksByProject(projectId: string): Promise<Task[]> {
    await this.initialize();
    return this.database?.tasks.filter((t) => t.projectId === projectId) || [];
  }

  /**
   * Crea una nueva tarea
   */
  async createTask(task: Task): Promise<Task> {
    await this.initialize();
    this.database!.tasks.push(task);
    this.save();
    return task;
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    await this.initialize();
    const index = this.database!.tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return null;
    }

    this.database!.tasks[index] = {
      ...this.database!.tasks[index],
      ...updates,
      id, // Asegurar que el ID no cambie
      updatedAt: new Date(),
    };

    this.save();
    return this.database!.tasks[index];
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id: string): Promise<boolean> {
    await this.initialize();
    const initialLength = this.database!.tasks.length;
    this.database!.tasks = this.database!.tasks.filter((t) => t.id !== id);

    if (this.database!.tasks.length < initialLength) {
      this.save();
      return true;
    }

    return false;
  }

  /**
   * Obtiene todos los miembros del equipo
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    await this.initialize();
    return [...(this.database?.teamMembers || [])];
  }

  /**
   * Obtiene un miembro del equipo por ID
   */
  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    await this.initialize();
    return this.database?.teamMembers.find((m) => m.id === id) || null;
  }

  /**
   * Crea un nuevo miembro del equipo
   */
  async createTeamMember(member: TeamMember): Promise<TeamMember> {
    await this.initialize();
    this.database!.teamMembers.push(member);
    this.save();
    return member;
  }

  /**
   * Actualiza un miembro del equipo existente
   */
  async updateTeamMember(
    id: string,
    updates: Partial<TeamMember>
  ): Promise<TeamMember | null> {
    await this.initialize();
    const index = this.database!.teamMembers.findIndex((m) => m.id === id);

    if (index === -1) {
      return null;
    }

    this.database!.teamMembers[index] = {
      ...this.database!.teamMembers[index],
      ...updates,
      id, // Asegurar que el ID no cambie
    };

    this.save();
    return this.database!.teamMembers[index];
  }

  /**
   * Elimina un miembro del equipo
   */
  async deleteTeamMember(id: string): Promise<boolean> {
    await this.initialize();
    const initialLength = this.database!.teamMembers.length;
    this.database!.teamMembers = this.database!.teamMembers.filter(
      (m) => m.id !== id
    );

    if (this.database!.teamMembers.length < initialLength) {
      this.save();
      return true;
    }

    return false;
  }

  /**
   * Exporta toda la base de datos como JSON
   */
  async exportDatabase(): Promise<DatabaseSchema> {
    await this.initialize();
    return JSON.parse(JSON.stringify(this.database));
  }

  /**
   * Importa una base de datos desde JSON
   */
  async importDatabase(data: DatabaseSchema): Promise<void> {
    this.database = data;
    this.parseDates(this.database);
    this.save();
    this.initialized = true;
  }

  /**
   * Limpia la base de datos (resetea a los datos originales del archivo)
   */
  async clearDatabase(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.database = null;
    this.initialized = false;
    await this.initialize();
    console.log('🔄 Database reset to original file');
  }

  /**
   * Exporta la base de datos actual como archivo JSON descargable
   */
  downloadDatabase(): void {
    if (!this.database) {
      console.error('No database to export');
      return;
    }

    const dataStr = JSON.stringify(this.database, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `database-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    console.log('📥 Database exported');
  }

  /**
   * Genera un nuevo ID único
   */
  generateId(
    type:
      | 'projects'
      | 'tasks'
      | 'teamMembers'
      | 'agents'
      | 'agentTasks'
      | 'agentLogs'
  ): string {
    if (!this.database) {
      return '1';
    }

    const items = this.database[type];
    if (!items || items.length === 0) {
      return '1';
    }

    const maxId = items.reduce((max: number, item: any) => {
      const id = parseInt(item.id, 10);
      return isNaN(id) ? max : Math.max(max, id);
    }, 0);

    return String(maxId + 1);
  }

  /**
   * Obtiene todos los agentes
   */
  async getAgents(): Promise<Agent[]> {
    await this.initialize();
    return [...(this.database?.agents || [])];
  }

  /**
   * Obtiene un agente por ID
   */
  async getAgentById(id: string): Promise<Agent | null> {
    await this.initialize();
    return this.database?.agents?.find((a) => a.id === id) || null;
  }

  /**
   * Crea un nuevo agente
   */
  async createAgent(agent: Agent): Promise<Agent> {
    await this.initialize();
    if (!this.database!.agents) {
      this.database!.agents = [];
    }
    this.database!.agents.push(agent);
    this.save();
    return agent;
  }

  /**
   * Actualiza un agente existente
   */
  async updateAgent(
    id: string,
    updates: Partial<Agent>
  ): Promise<Agent | null> {
    await this.initialize();
    if (!this.database!.agents) {
      return null;
    }

    const index = this.database!.agents.findIndex((a) => a.id === id);
    if (index === -1) {
      return null;
    }

    this.database!.agents[index] = {
      ...this.database!.agents[index],
      ...updates,
      id,
    };

    this.save();
    return this.database!.agents[index];
  }

  /**
   * Elimina un agente
   */
  async deleteAgent(id: string): Promise<boolean> {
    await this.initialize();
    if (!this.database!.agents) {
      return false;
    }

    const initialLength = this.database!.agents.length;
    this.database!.agents = this.database!.agents.filter((a) => a.id !== id);

    if (this.database!.agents.length < initialLength) {
      this.save();
      return true;
    }

    return false;
  }

  /**
   * Obtiene todas las tareas de agentes
   */
  async getAgentTasks(): Promise<AgentTask[]> {
    await this.initialize();
    return [...(this.database?.agentTasks || [])];
  }

  /**
   * Obtiene una tarea de agente por ID
   */
  async getAgentTaskById(id: string): Promise<AgentTask | null> {
    await this.initialize();
    return this.database?.agentTasks?.find((t) => t.id === id) || null;
  }

  /**
   * Crea una nueva tarea de agente
   */
  async createAgentTask(task: AgentTask): Promise<AgentTask> {
    await this.initialize();
    if (!this.database!.agentTasks) {
      this.database!.agentTasks = [];
    }
    this.database!.agentTasks.push(task);
    this.save();
    return task;
  }

  /**
   * Actualiza una tarea de agente existente
   */
  async updateAgentTask(
    id: string,
    updates: Partial<AgentTask>
  ): Promise<AgentTask | null> {
    await this.initialize();
    if (!this.database!.agentTasks) {
      return null;
    }

    const index = this.database!.agentTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }

    this.database!.agentTasks[index] = {
      ...this.database!.agentTasks[index],
      ...updates,
      id,
      updatedAt: new Date(),
    };

    this.save();
    return this.database!.agentTasks[index];
  }

  /**
   * Elimina una tarea de agente
   */
  async deleteAgentTask(id: string): Promise<boolean> {
    await this.initialize();
    if (!this.database!.agentTasks) {
      return false;
    }

    const initialLength = this.database!.agentTasks.length;
    this.database!.agentTasks = this.database!.agentTasks.filter(
      (t) => t.id !== id
    );

    if (this.database!.agentTasks.length < initialLength) {
      this.save();
      return true;
    }

    return false;
  }
}
