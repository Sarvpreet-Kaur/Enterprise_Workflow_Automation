import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../core/services/user.service';
import { CreateUser } from '../../../core/models/createUser.model';
import { UpdateUser } from '../../../core/models/updateUser.model';
import { AlertService } from '../../../core/services/alert.service';
import { UpdateTeam } from '../../../core/models/updateTeam.model';
import { TeamService } from '../../../core/services/teams.services';
import { CreateTeam } from '../../../core/models/createTeam.model';
import { Team } from '../../../core/models/teams.model';
import { WorkflowService } from '../../../core/services/workflow.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Workflow, WorkflowStep } from '../../../core/models/workflow.model';
import { CreateWorkflow } from '../../../core/models/createWorkflow.model';
import { UpdateWorkflow } from '../../../core/models/updateWorkflow.model';

@Component({
  selector: 'app-workflow-form',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatLabel,
    MatRadioButton,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  templateUrl: './workflow-form.html',
  styleUrl: './workflow-form.css',
})
export class WorkflowForm implements OnInit {
  workflowForm!: FormGroup;
  isEdit = false;
  isSaving = false;

  data = inject(MAT_DIALOG_DATA);
  workflow: Workflow | null = null;

  private fb = inject(FormBuilder);
  private workflowService = inject(WorkflowService);
  public dialogRef = inject(MatDialogRef<WorkflowForm>);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.workflow = this.data?.workflow ?? null;
    this.isEdit = this.data.isEdit ?? false;

    this.workflowForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isActive: [true],
      steps: this.fb.array([]),
    });

    if (this.isEdit && this.workflow) {
      this.workflowForm.patchValue({
        name: this.workflow.name,

        description: this.workflow.description,

        isActive: this.workflow.isActive,
      });

      this.steps.clear();

      this.workflow.steps.forEach((step) => {
        this.steps.push(this.createStep(step));
      });
    }
  }

  get steps(): FormArray {
    return this.workflowForm.get('steps') as FormArray;
  }

  createStep(step?: WorkflowStep): FormGroup {
    return this.fb.group({
      order: [step?.order ?? this.steps.length + 1],
      approverRole: [step?.approverRole ?? '', Validators.required],
      canReject: [step?.canReject ?? true],
    });
  }

  save() {
    if (this.workflowForm.invalid) {
      Object.values(this.workflowForm.controls).forEach((control) => {
        control.markAsTouched();

        control.updateValueAndValidity();
      });

      return;
    }

    if (this.steps.length === 0) {
      this.alertService.error('Validation', 'Please add at least one approval step.');

      return;
    }

    this.isSaving = true;

    if (this.isEdit) {
      this.updateWorkflow();
    } else {
      this.createWorkflow();
    }
  }

  createWorkflow() {
    const payload: CreateWorkflow = this.workflowForm.getRawValue();

    this.workflowService.createWorkflow(payload).subscribe({
      next: () => {
        this.isSaving = false;

        this.dialogRef.close(true);

        this.alertService.success('Workflow Created', 'Workflow created successfully.');
      },

      error: (err) => {
        this.isSaving = false;

        this.alertService.error('Creation Failed', err.error.message);
      },
    });
  }

  updateWorkflow() {
    const payload: UpdateWorkflow = this.workflowForm.getRawValue();

    this.workflowService.updateWorkflow(this.workflow!._id, payload).subscribe({
      next: () => {
        this.isSaving = false;

        this.dialogRef.close(true);

        this.alertService.success('Workflow Updated', 'Workflow updated successfully.');
      },

      error: (err) => {
        this.isSaving = false;

        this.alertService.error('Update Failed', err.error.message);
      },
    });
  }

  addStep() {
    this.steps.push(this.createStep());
    console.log(this.steps.value);
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
    this.updateOrder();
  }

  updateOrder() {
    this.steps.controls.forEach((step, index) => {
      step.patchValue({
        order: index + 1,
      });
    });
  }
}
