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

@Component({
  selector: 'app-user-form',
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

  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  isSaving = false;
  hidePassword = true;

  currentDate: Date = new Date();
  userForm!: FormGroup;

  data = inject(MAT_DIALOG_DATA);
  teams = this.data.teams;
  isEdit = this.data.isEdit ?? false;
  user = this.data.user;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public dialogRef = inject(MatDialogRef<UserForm>);
  private alertService = inject(AlertService);

  ngOnInit() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.pattern(this.password)],
      ],
      role: ['', Validators.required],
      teams: ['', Validators.required],
      isActive: [true],
    });
    if (this.isEdit) {
      this.userForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        role: this.user.role,
        teams: this.user.teams[0]._id,
        isActive: this.user.isActive,
      });
      this.userForm.get('password')?.clearValidators();

      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  save() {
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      console.log('Invalid');

      return;
    }
    this.isSaving = true;
    console.log(this.isEdit);
    if (this.isEdit) {
      const formValue = this.userForm.value;
      const payload: UpdateUser = {
        firstName: formValue.firstName!,

        lastName: formValue.lastName!,

        email: formValue.email!,

        role: formValue.role!,

        teams: [formValue.teams!],

        isActive: formValue.isActive!,
      };

      this.userService.updateUser(this.user._id, payload).subscribe({
        next: () => {
          // this.isSaving = false;
          this.dialogRef.close(true);
          this.alertService.success('User Created', 'The user has been updated successfully.');
        },
        error: (err) => {
          // this.isSaving = false;
          console.log(err);
        },
      });
    } else {
      const formValue = this.userForm.value;
      const payload: CreateUser = {
        firstName: formValue.firstName!,

        lastName: formValue.lastName!,

        email: formValue.email!,

        password: formValue.password!,

        role: formValue.role!,

        teams: [formValue.teams!],

        isActive: formValue.isActive!,
      };

      this.userService.createUser(payload).subscribe({
        next: () => {
          // this.isSaving = false;
          this.dialogRef.close(true);
          this.alertService.success('User Created', 'The user has been created successfully.');
        },
        error: (err) => {
          // this.isSaving = false;
          console.log('in updation  ' + err);
        },
      });
    }
  }

}
