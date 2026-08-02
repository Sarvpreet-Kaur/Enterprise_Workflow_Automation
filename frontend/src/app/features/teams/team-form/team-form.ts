import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
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
import { UpdateTeam } from '../../../core/models/updateTeam.model';
import { TeamService } from '../../../core/services/teams.services';
import { CreateTeam } from '../../../core/models/createTeam.model';
import { Team } from '../../../core/models/teams.model';

@Component({
  selector: 'app-team-form',
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
  templateUrl: './team-form.html',
  styleUrl: './team-form.css',
})
export class TeamForm implements OnInit {
  managers: User[] = [];
  admins: User[] = [];

  teamForm!: FormGroup;
  isSaving = false;
  isEdit = false;

  data = inject(MAT_DIALOG_DATA);
  team: Team | null = null;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public dialogRef = inject(MatDialogRef<TeamForm>);
  private alertService = inject(AlertService);
  private teamService = inject(TeamService);

  ngOnInit() {
    this.team = this.data?.team ?? null;
    this.isEdit = this.data.isEdit ?? false;
    this.loadManagers();
    this.loadAdmins();

    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      manager: ['', Validators.required],
      admin: ['', Validators.required],
      isActive: [true],
    });
    if (this.isEdit && this.team) {
      this.teamForm.patchValue({
        name: this.team.name,
        department: this.team.department,
        isActive: this.team.isActive,
      });
    }
  }

  loadManagers() {
    this.userService
      .getUsers({
        role: 'manager',
        page: 1,
        limit: 100,
      })
      .subscribe({
        next: (response) => {
          this.managers = response.data.filter((manager)=>manager.isActive);

          if (this.isEdit && this.team) {
            this.teamForm.patchValue({
              manager: this.team.manager?._id,
            });
          }
        },
      });
  }

  loadAdmins() {
    this.userService
      .getUsers({
        role: 'admin',
        page: 1,
        limit: 100,
      })
      .subscribe({
        next: (response) => {
          this.admins = response.data.filter((admin)=>admin.isActive);;

          if (this.isEdit && this.team) {
            this.teamForm.patchValue({
              admin: this.team.admin?._id,
            });
          }
        },
      });
  }

  save() {
    if (this.teamForm.invalid) {
      Object.values(this.teamForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      console.log('Invalid');

      return;
    }
    this.isSaving = true;
    console.log(this.isEdit);
    if (this.isEdit && this.team) {
      const formValue = this.teamForm.value;
      const payload: UpdateTeam = {
        name: formValue.name!,

        department: formValue.department!,

        admin: formValue.admin!,

        manager: formValue.manager!,

        isActive: formValue.isActive!,
      };

      this.teamService.updateTeam(this.team._id, payload).subscribe({
        next: () => {
          // this.isSaving = false;
          this.dialogRef.close(true);
          this.alertService.success('Team Updated', 'The team has been updated successfully.');
        },
        error: (err) => {
          // this.isSaving = false;
          console.log(err);
        },
      });
    } else {
      const formValue = this.teamForm.value;
      const payload: CreateTeam = {
        name: formValue.name!,

        department: formValue.department!,

        admin: formValue.admin!,

        manager: formValue.manager!,

        isActive: formValue.isActive!,
      };

      this.teamService.createTeam(payload).subscribe({
        next: () => {
          // this.isSaving = false;
          this.dialogRef.close(true);
          this.alertService.success('Team Created', 'The team has been created successfully.');
        },
        error: (err) => {
          // this.isSaving = false;
          console.log('in creation  ' + err);
        },
      });
    }
  }
}
