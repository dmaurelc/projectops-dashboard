import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskCreateDto, TaskPriority } from '@core/models/task.model';
import { TaskStatus } from '@core/models/status.model';
import { ProjectService } from '@core/services/project.service';
import { TeamService } from '@core/services/team.service';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, StatusLabelPipe],
  template: `
    <form [formGroup]="form" class="task-form" (ngSubmit)="handleSubmit()">
      <div class="form-group">
        <label for="title">Task Title *</label>
        <input
          type="text"
          id="title"
          formControlName="title"
          placeholder="Enter task title"
          [class.error]="form.get('title')?.invalid && form.get('title')?.touched"
        />
        <span class="error-message" *ngIf="form.get('title')?.invalid && form.get('title')?.touched">
          Task title is required
        </span>
      </div>

      <div class="form-group">
        <label for="description">Description *</label>
        <textarea
          id="description"
          formControlName="description"
          rows="3"
          placeholder="Enter task description"
          [class.error]="form.get('description')?.invalid && form.get('description')?.touched"
        ></textarea>
        <span class="error-message" *ngIf="form.get('description')?.invalid && form.get('description')?.touched">
          Description is required
        </span>
      </div>

      <div class="form-group">
        <label for="projectId">Project *</label>
        <select id="projectId" formControlName="projectId" [class.error]="form.get('projectId')?.invalid && form.get('projectId')?.touched">
          <option value="">Select a project</option>
          <option *ngFor="let project of projects()" [value]="project.id">
            {{ project.name }}
          </option>
        </select>
        <span class="error-message" *ngIf="form.get('projectId')?.invalid && form.get('projectId')?.touched">
          Project selection is required
        </span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" formControlName="status">
            <option value="todo">{{ 'todo' | statusLabel }}</option>
            <option value="in_progress">{{ 'in_progress' | statusLabel }}</option>
            <option value="in_review">{{ 'in_review' | statusLabel }}</option>
            <option value="done">{{ 'done' | statusLabel }}</option>
            <option value="blocked">{{ 'blocked' | statusLabel }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority">Priority *</label>
          <select id="priority" formControlName="priority">
            <option value="low">{{ 'low' | statusLabel }}</option>
            <option value="medium">{{ 'medium' | statusLabel }}</option>
            <option value="high">{{ 'high' | statusLabel }}</option>
            <option value="critical">{{ 'critical' | statusLabel }}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="assignedToId">Assigned To</label>
        <select id="assignedToId" formControlName="assignedToId">
          <option value="">Unassigned</option>
          <option *ngFor="let member of teamMembers()" [value]="member.id">
            {{ member.name }} ({{ member.role }})
          </option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="estimatedHours">Estimated Hours</label>
          <input
            type="number"
            id="estimatedHours"
            formControlName="estimatedHours"
            min="0"
            step="0.5"
            placeholder="0"
          />
        </div>

        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            formControlName="dueDate"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          formControlName="tags"
          placeholder="e.g., frontend, bug, urgent"
        />
        <small class="helper-text">Enter tags separated by commas</small>
      </div>

      <div class="form-actions">
        <app-button type="button" variant="outline" (clicked)="cancel.emit()">
          Cancel
        </app-button>
        <app-button type="submit" variant="default" [disabled]="form.invalid || submitting()">
          {{ task ? 'Update' : 'Create' }} Task
        </app-button>
      </div>
    </form>
  `,
  styles: [`
    .task-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    input,
    textarea,
    select {
      padding: 0.625rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
      transition: all 0.2s;
      background: white;
    }

    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input.error,
    textarea.error,
    select.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: -0.25rem;
    }

    .helper-text {
      color: #6b7280;
      font-size: 0.75rem;
      margin-top: -0.25rem;
    }

    select {
      cursor: pointer;
      text-transform: capitalize;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private teamService = inject(TeamService);

  @Input() task?: Task;
  @Input() projectId?: string;
  @Output() save = new EventEmitter<TaskCreateDto | Task>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  submitting = signal(false);
  projects = this.projectService.projects;
  teamMembers = this.teamService.members;

  ngOnInit(): void {
    this.projectService.loadProjects();
    this.teamService.loadMembers();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['task'] || changes['projectId']) && this.form) {
      this.initForm();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || '', Validators.required],
      projectId: [this.task?.projectId || this.projectId || '', Validators.required],
      status: [this.task?.status || TaskStatus.TODO, Validators.required],
      priority: [this.task?.priority || TaskPriority.MEDIUM, Validators.required],
      assignedToId: [this.task?.assignedToId || ''],
      dueDate: [this.task?.dueDate ? this.formatDate(this.task.dueDate) : ''],
      estimatedHours: [this.task?.estimatedHours || null],
      tags: [this.task?.tags?.join(', ') || '']
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value;
    const tags = formValue.tags
      ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : [];

    const taskData: TaskCreateDto = {
      projectId: formValue.projectId,
      title: formValue.title,
      description: formValue.description,
      status: formValue.status,
      priority: formValue.priority,
      assignedToId: formValue.assignedToId || undefined,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
      estimatedHours: formValue.estimatedHours || undefined,
      tags
    };

    if (this.task) {
      this.save.emit({ ...taskData, id: this.task.id } as any);
    } else {
      this.save.emit(taskData);
    }

    setTimeout(() => this.submitting.set(false), 500);
  }
}
