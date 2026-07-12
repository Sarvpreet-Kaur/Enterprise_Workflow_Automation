import { Component, inject, OnInit, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../core/services/user.service';
import { User, CreateUserRequest } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-form-dialog',
  imports: [MatIconModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.css',
})
export class UserFormDialog implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<UserFormDialog>);

  private data = inject(MAT_DIALOG_DATA) as User | null;

  userForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      ],
    ],
    department: ['', [Validators.required]],
    role: ['employee', [Validators.required]],
    managerId: [''],
  });

  managers: User[] = [];
  isEditMode = false;

  ngOnInit() {
    this.loadManagers();
    this.updateManagerValidation(this.userForm.get('role')?.value);

    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      this.updateManagerValidation(role);
    });
  }

  private updateManagerValidation(role: string | null | undefined) {
    const managerControl = this.userForm.get('managerId');

    if (role === 'employee') {
      managerControl?.setValidators([Validators.required]);
    } else {
      managerControl?.clearValidators();
      managerControl?.setValue('');
    }

    managerControl?.updateValueAndValidity();
  }

  private initializeEditMode() {
    this.isEditMode = true;

    this.userForm.patchValue({
      firstName: this.data!.firstName,
      lastName: this.data!.lastName,
      email: this.data!.email,
      department: this.data!.department,
      role: this.data!.role,
      managerId: this.data!.managerId,
    });

    this.userForm.controls.password.setValidators([
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]);
    this.userForm.controls.password.updateValueAndValidity();
  }

  loadManagers() {
    this.userService.getUsers({ role: 'manager' }).subscribe((res) => {
      this.managers = res.data;
      if (this.data) {
        this.initializeEditMode();
      }

      this.updateManagerValidation(this.userForm.controls.role.value);

      this.userForm.controls.role.valueChanges.subscribe((role) => {
        this.updateManagerValidation(role);
      });
    });
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    const payload: CreateUserRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      department: formValue.department,
      role: formValue.role,
    };

    if (formValue.role === 'employee') {
      payload.managerId = formValue.managerId;
    }

    if (this.isEditMode) {
      this.userService.updateUser(this.data!._id!, this.userForm.value as User).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
      });
    } else {
      this.userService.createUser(this.userForm.value as User).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
      });
    }
  }
}
