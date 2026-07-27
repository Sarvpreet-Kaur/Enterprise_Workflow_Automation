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
    MatCheckboxModule
  ],
  templateUrl: './workflow-form.html',
  styleUrl: './workflow-form.css',
})
export class WorkflowForm implements OnInit {
  workflowForm!: FormGroup;
  isEdit = false;
  isSaving = false;

  private fb = inject(FormBuilder);
  private workflowService = inject(WorkflowService);
  public dialogRef = inject(MatDialogRef<WorkflowForm>);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.workflowForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isActive: [true],
      steps: this.fb.array([]),
    });
  }

  get steps(): FormArray {
    return this.workflowForm.get('steps') as FormArray;
  }

  createStep() {
    return this.fb.group({
      order: [this.steps.length + 1],
      approverRole: ['', Validators.required],
      canReject: [true],
    });
  }
  save() {}
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
