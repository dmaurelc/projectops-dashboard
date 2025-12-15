import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamMember, TeamMemberCreateDto, MemberRole } from '@core/models/team-member.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, StatusLabelPipe],
  template: `
    <form [formGroup]="form" class="member-form" (ngSubmit)="handleSubmit()">
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          placeholder="Enter full name"
          [class.error]="form.get('name')?.invalid && form.get('name')?.touched"
        />
        <span class="error-message" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
          Name is required
        </span>
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input
          type="email"
          id="email"
          formControlName="email"
          placeholder="email@example.com"
          [class.error]="form.get('email')?.invalid && form.get('email')?.touched"
        />
        <span class="error-message" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
          Valid email is required
        </span>
      </div>

      <div class="form-group">
        <label for="role">Role *</label>
        <select id="role" formControlName="role" [class.error]="form.get('role')?.invalid && form.get('role')?.touched">
          <option value="">Select a role</option>
          <option value="admin">{{ 'admin' | statusLabel }}</option>
          <option value="project_manager">{{ 'project_manager' | statusLabel }}</option>
          <option value="developer">{{ 'developer' | statusLabel }}</option>
          <option value="designer">{{ 'designer' | statusLabel }}</option>
          <option value="qa">{{ 'qa' | statusLabel }}</option>
          <option value="stakeholder">{{ 'stakeholder' | statusLabel }}</option>
        </select>
        <span class="error-message" *ngIf="form.get('role')?.invalid && form.get('role')?.touched">
          Role selection is required
        </span>
      </div>

      <div class="form-group">
        <label for="skills">Skills (comma separated)</label>
        <input
          type="text"
          id="skills"
          formControlName="skills"
          placeholder="e.g., JavaScript, React, Node.js"
        />
        <small class="helper-text">Enter skills separated by commas</small>
      </div>

      <div class="form-group">
        <label for="avatar">Avatar URL</label>
        <input
          type="url"
          id="avatar"
          formControlName="avatar"
          placeholder="https://example.com/avatar.jpg"
        />
        <small class="helper-text">Optional: Enter avatar image URL</small>
      </div>

      <div class="form-group">
        <label for="availability">Availability (%)</label>
        <input
          type="number"
          id="availability"
          formControlName="availability"
          min="0"
          max="100"
          placeholder="100"
        />
        <small class="helper-text">Percentage of time available (0-100)</small>
      </div>

      <div class="form-actions">
        <app-button type="button" variant="outline" (clicked)="cancel.emit()">
          Cancel
        </app-button>
        <app-button type="submit" variant="default" [disabled]="form.invalid || submitting()">
          {{ member ? 'Update' : 'Add' }} Member
        </app-button>
      </div>
    </form>
  `,
  styles: [`
    .member-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    input,
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
    select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input.error,
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
  `]
})
export class MemberFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() member?: TeamMember;
  @Output() save = new EventEmitter<TeamMemberCreateDto | TeamMember>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  submitting = signal(false);

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['member'] && this.form) {
      this.initForm();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [this.member?.name || '', Validators.required],
      email: [this.member?.email || '', [Validators.required, Validators.email]],
      role: [this.member?.role || '', Validators.required],
      skills: [this.member?.skills?.join(', ') || ''],
      avatar: [this.member?.avatar || ''],
      availability: [this.member?.availability || 100, [Validators.min(0), Validators.max(100)]]
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value;
    const skills = formValue.skills
      ? formValue.skills.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill)
      : [];

    const memberData: TeamMemberCreateDto = {
      name: formValue.name,
      email: formValue.email,
      role: formValue.role as MemberRole,
      skills,
      avatar: formValue.avatar || undefined,
      availability: formValue.availability
    };

    if (this.member) {
      this.save.emit({ ...memberData, id: this.member.id } as any);
    } else {
      this.save.emit(memberData);
    }

    setTimeout(() => this.submitting.set(false), 500);
  }
}
