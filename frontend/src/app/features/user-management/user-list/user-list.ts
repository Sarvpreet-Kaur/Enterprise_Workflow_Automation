import { Component, inject, AfterViewInit, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { User } from '../../../core/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UserFormDialog } from '../user-form-dialog/user-form-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../../shared/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-user-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  filterForm = this.fb.group({
    search: [''],
    role: [''],
    department: [''],
    status: [''],
  });

  users = new MatTableDataSource<User>();
  totalRecords = 0;
  search = '';
  selectedRole = '';
  selectedDepartment = '';
  selectedStatus = '';
  displayedColumns: string[] = ['name', 'email', 'department', 'role', 'status', 'actions'];

  ngOnInit() {
    this.loadUsers();

    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.loadUsers();
    });
  }

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
    this.paginator.page.subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers() {
    const params: any = {};
    params.page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    params.limit = this.paginator ? this.paginator.pageSize : 10;

    const filters = this.filterForm.value;
    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.role) {
      params.role = filters.role;
    }

    if (filters.department) {
      params.department = filters.department;
    }

    if (filters.status !== '') {
      params.status = filters.status;
    }
    this.userService.getUsers(params).subscribe({
      next: (res) => {
        this.users.data = res.data;
        this.totalRecords = res.pagination.totalRecords;
        console.log(this.users);
      },
      error: (err) => {
        console.error('Error in load users: ' + err);
      },
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(UserFormDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openEditDialog(user: User) {
    const dialogRef = this.dialog.open(UserFormDialog, {
      width: '600px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '420px',

      data: {
        title: 'Delete User',

        message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,

        confirmButtonText: 'Delete',

        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.userService.deleteUser(user._id!).subscribe({
        next: () => {
          this.loadUsers();
        },

        error: (err) => {
          console.error(err);
        },
      });
    });
  }
}
