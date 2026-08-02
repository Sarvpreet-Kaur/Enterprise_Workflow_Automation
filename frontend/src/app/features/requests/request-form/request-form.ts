import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { RequestService } from '../../../core/services/request.service';
import { AuthService } from '../../../core/services/auth.service';
import { UpdateRequest } from '../../../core/models/updateRequest.model';
import { CreateRequest } from '../../../core/models/createRequest.model';
import { Request } from '../../../core/models/request.model';
import { Team } from '../../../core/models/teams.model';
import { Workflow } from '../../../core/models/workflow.model';
import { TeamService } from '../../../core/services/teams.services';

@Component({
  selector: 'app-request-form',
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
  ],
  templateUrl: './request-form.html',
  styleUrl: './request-form.css',
})
export class RequestForm implements OnInit {
  isSaving = false;
  isManager = false;
  requestForm!: FormGroup;
  isTeamsLoading = false;

  data = inject(MAT_DIALOG_DATA);
  teams: Team[] = [];
  isEdit = false;
  request: Request | null = null;
  workflows: Workflow[] = [];

  private fb = inject(FormBuilder);
  private requestService = inject(RequestService);
  private teamService = inject(TeamService);
  private authService = inject(AuthService);
  public dialogRef = inject(MatDialogRef<RequestForm>);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.loadTeams();
    this.request = this.data?.request ?? null;
    this.isEdit = this.data?.isEdit ?? false;
    this.workflows = this.data?.workflows ?? [];

    this.isManager = this.authService.getCurrentUserRole() === 'manager';
    console.log(this.isManager);

    this.requestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      workflow: ['', Validators.required],
      team: [''],
      priority: ['', Validators.required],
    });

    if (this.isManager) {
      this.requestForm.get('team')?.setValidators(Validators.required);
      this.requestForm.get('team')?.updateValueAndValidity();
    }

    if (this.isEdit && this.request) {
      this.requestForm.patchValue({
        title: this.request.title,
        description: this.request.description,
        workflow: this.request.workflow._id,
        team: this.request.team._id,
        priority: this.request.priority,
      });
    }
  }

  save() {
    if (this.requestForm.invalid) {
      Object.values(this.requestForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      console.log('Invalid');

      return;
    }
    this.isSaving = true;
    console.log(this.isEdit);

    if (this.isEdit && this.request) {
      const formValue = this.requestForm.value;
      const payload: UpdateRequest = {
        title: formValue.title!,
        description: formValue.description!,
        workflow: formValue.workflow!,
        team: formValue.team!,
        priority: formValue.priority!,
      };

      this.requestService.updateRequest(this.request._id, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.dialogRef.close(true);
          this.alertService.success('Draft Updated', 'The request has been updated successfully.');
        },
        error: (err) => {
          this.isSaving = false;
          console.log(err);
          this.alertService.error(
            'Update Failed',

            err.error.message,
          );
        },
      });
    } else {
      const formValue = this.requestForm.value;
      const payload: CreateRequest = {
        title: formValue.title!,
        description: formValue.description!,
        workflow: formValue.workflow!,
        team: formValue.team!,
        priority: formValue.priority!,
      };

      this.requestService.createRequest(payload).subscribe({
        next: () => {
          // this.isSaving = false;
          this.dialogRef.close(true);
          this.alertService.success('Draft Created', 'Draft has been created successfully.');
        },
        error: (err) => {
          // this.isSaving = false;
          console.log('in updation  ' + err);
        },
      });
    }
  }

  loadTeams(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    this.teamService
      .getTeams({
        manager: currentUser._id,
        page: 1,
        limit: 100,
      })
      .subscribe({
        next: (response) => {
          this.teams = response.data;
          this.isTeamsLoading = true;

          if (this.teams.length === 0) {
            this.alertService.error(
              'No Team Assigned',
              'You must be assigned to at least one team before creating a request.',
            );

            this.dialogRef.close();
          }
        },
      });
  }
}
