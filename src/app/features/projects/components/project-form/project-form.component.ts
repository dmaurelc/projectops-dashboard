import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project, ProjectCreateDto } from '@core/models/project.model';
import { ProjectStatus } from '@core/models/status.model';
import { TeamService } from '@core/services/team.service';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, StatusLabelPipe],
  template: `
    <form [formGroup]="form" class="project-form" (ngSubmit)="handleSubmit()">
      <div class="form-group">
        <label for="name">Project Name *</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          placeholder="Enter project name"
          [class.error]="form.get('name')?.invalid && form.get('name')?.touched"
        />
        <span class="error-message" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
          Project name is required
        </span>
      </div>

      <div class="form-group">
        <label for="description">Description *</label>
        <textarea
          id="description"
          formControlName="description"
          rows="4"
          placeholder="Enter project description"
          [class.error]="form.get('description')?.invalid && form.get('description')?.touched"
        ></textarea>
        <span class="error-message" *ngIf="form.get('description')?.invalid && form.get('description')?.touched">
          Description is required
        </span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" formControlName="status">
            <option value="planning">{{ 'planning' | statusLabel }}</option>
            <option value="in_progress">{{ 'in_progress' | statusLabel }}</option>
            <option value="on_hold">{{ 'on_hold' | statusLabel }}</option>
            <option value="completed">{{ 'completed' | statusLabel }}</option>
            <option value="cancelled">{{ 'cancelled' | statusLabel }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="progress">Progress (%)</label>
          <input
            type="number"
            id="progress"
            formControlName="progress"
            min="0"
            max="100"
            placeholder="0"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Start Date *</label>
          <input
            type="date"
            id="startDate"
            formControlName="startDate"
            [class.error]="form.get('startDate')?.invalid && form.get('startDate')?.touched"
          />
        </div>

        <div class="form-group">
          <label for="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            formControlName="endDate"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="budget">Budget ($)</label>
        <input
          type="number"
          id="budget"
          formControlName="budget"
          min="0"
          step="1000"
          placeholder="0"
        />
      </div>

      <div class="form-group">
        <label>Team Members</label>
        <div class="members-selector">
          <div
            *ngFor="let member of teamMembers()"
            class="member-option"
          >
            <label class="checkbox-label">
              <input
                type="checkbox"
                [value]="member.id"
                [checked]="isSelected(member.id)"
                (change)="toggleMember(member.id)"
              />
              <span>{{ member.name }} <small>({{ member.role }})</small></span>
            </label>
          </div>
          <p *ngIf="teamMembers().length === 0" class="empty-message">
            No team members available
          </p>
        </div>
      </div>

      <div class="form-actions">
        <app-button type="button" variant="outline" (clicked)="cancel.emit()">
          Cancel
        </app-button>
        <app-button type="submit" variant="default" [disabled]="form.invalid || submitting()">
          {{ project ? 'Update' : 'Create' }} Project
        </app-button>
      </div>
    </form>
  `,
  styles: [`
    .project-form {
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
    textarea.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: -0.25rem;
    }

    select {
      cursor: pointer;
      text-transform: capitalize;
    }

    .members-selector {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 0.75rem;
      background: #f9fafb;
    }

    .member-option {
      padding: 0.5rem 0;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-weight: normal;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .checkbox-label span {
      color: #374151;
    }

    .checkbox-label small {
      color: #6b7280;
      text-transform: capitalize;
    }

    .empty-message {
      color: #9ca3af;
      font-size: 0.875rem;
      font-style: italic;
      margin: 0;
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
export class ProjectFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);

  @Input() project?: Project;
  @Output() save = new EventEmitter<ProjectCreateDto | Project>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  submitting = signal(false);
  teamMembers = this.teamService.members;
  selectedMembers = signal<string[]>([]);

  ngOnInit(): void {
    this.teamService.loadMembers();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.form) {
      this.initForm();
    }
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      name: [this.project?.name || '', Validators.required],
      description: [this.project?.description || '', Validators.required],
      status: [this.project?.status || ProjectStatus.PLANNING, Validators.required],
      startDate: [this.project?.startDate ? this.formatDate(this.project.startDate) : today, Validators.required],
      endDate: [this.project?.endDate ? this.formatDate(this.project.endDate) : ''],
      budget: [this.project?.budget || null],
      progress: [this.project?.progress || 0]
    });

    if (this.project?.teamMemberIds) {
      this.selectedMembers.set([...this.project.teamMemberIds]);
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  isSelected(memberId: string): boolean {
    return this.selectedMembers().includes(memberId);
  }

  toggleMember(memberId: string): void {
    const current = this.selectedMembers();
    if (current.includes(memberId)) {
      this.selectedMembers.set(current.filter(id => id !== memberId));
    } else {
      this.selectedMembers.set([...current, memberId]);
    }
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value;
    const projectData: ProjectCreateDto = {
      name: formValue.name,
      description: formValue.description,
      status: formValue.status,
      startDate: new Date(formValue.startDate),
      endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
      budget: formValue.budget || undefined,
      teamMemberIds: this.selectedMembers()
    };

    if (this.project) {
      this.save.emit({ ...projectData, id: this.project.id } as any);
    } else {
      this.save.emit(projectData);
    }

    setTimeout(() => this.submitting.set(false), 500);
  }
}
