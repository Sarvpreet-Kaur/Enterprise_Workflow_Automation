import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { Pagination } from '../../../core/models/paginationmodel';
import { UserService } from '../../../core/services/user.service';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { FilterBar } from '../../../shared/components/filter-bar/filter-bar';
import { FilterConfig } from '../../../core/models/filterConfig.model';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    EmptyState,
    FilterBar
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  users: User[] = [];

  isLoading = false;
  displayedColumns = [
    'name',
    'email',
    'role',
    'teams',
    'status',
    'actions'
  ];
  currentPage = 1;
  pageSize = 3;
  pagination: Pagination = {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 0,
    pageSize: this.pageSize
  };
  userFilters: FilterConfig[] = [
    {
        key:'role',
        label:'Role',
        options:[
          { label: 'All Roles', value: '' },
          { label: 'Admin', value: 'admin' },
          { label: 'Manager', value: 'manager' },
          { label: 'Employee', value: 'employee' }
        ]
    },
    {
        key:'status',
        label:'Status',
        options:[
          { label: 'All Status', value: '' },
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' }
        ]
    },
    {
        key:'teams',
        label:'Teams',
        options:[] //TODO: extract teams data from teams api
    }
];
  searchControl = new FormControl('', { nonNullable: true });
  selectedFilters: Record<string,string> = {};

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef)

  ngOnInit() {
    this.loadUsers();
    this.listenSearch();
  }

  loadUsers(): void {

    this.isLoading = true;
    this.userService.getUsers({search:this.searchControl.value,
       page: this.currentPage,
       limit: this.pageSize,
       ...this.selectedFilters
      }).subscribe({
      next: (response) => {
        this.users = response.data;
        this.pagination = response.pagination
        // this.pagination = response.pagination;
        this.isLoading = false;

        console.log(this.users);
        this.cdr.detectChanges()
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  listenSearch(){
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged())
    .subscribe(search => {
      this.currentPage = 1
      this.loadUsers();
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onFiltersChanged(filters:Record<string,string>){
    this.selectedFilters=filters;
    this.currentPage=1;
    this.loadUsers();

  }
}
