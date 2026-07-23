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
import { ViewChild } from '@angular/core';
import { DashboardCard } from '../../../core/models/dashboardCard.model';
import { StatCard } from '../../../shared/components/stat-card/stat-card';

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
    FilterBar,
    StatCard
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  users: User[] = [];

  isLoading = false;
  displayedColumns = ['name', 'email', 'role', 'teams', 'status', 'actions'];
  currentPage = 1;
  pageSize = 5;
  pagination: Pagination = {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 0,
    pageSize: this.pageSize,
  };
  userFilters: FilterConfig[] = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { label: 'All Roles', value: '' },
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Employee', value: 'employee' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All Status', value: '' },
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' },
      ],
    },
    {
      key: 'teams',
      label: 'Teams',
      options: [], //TODO: extract teams data from teams api
    },
  ];
  cards: DashboardCard[] = [];
  searchControl = new FormControl('', { nonNullable: true });
  selectedFilters: Record<string, string> = {};
  @ViewChild('filterBar') filterBar!: FilterBar;

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadUsers();
    this.listenSearch();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService
      .getUsers({
        search: this.searchControl.value,
        page: this.currentPage,
        limit: this.pageSize,
        ...this.selectedFilters,
      })
      .subscribe({
        next: (response) => {
          this.users = response.data;
          this.buildCards(response.summary);
          this.pagination = response.pagination;
          // this.pagination = response.pagination;
          this.isLoading = false;

          console.log(this.users);
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  listenSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((search) => {
        this.currentPage = 1;
        this.loadUsers();
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onFiltersChanged(filters: Record<string, string>) {
    this.selectedFilters = filters;
    this.currentPage = 1;
    this.loadUsers();
  }
  resetFilters() {
    this.searchControl.setValue('');

    this.filterBar.resetFilters();

    this.currentPage = 1;
    this.selectedFilters = {};

    this.loadUsers();
  }

  buildCards(summary: {totalUsers: number, activeUsers: number, inActiveUsers: number, admins: number}) {
    this.cards = [
      {
        title: 'Total Users',
        value: summary?.totalUsers,
        icon: 'group',
      },

      {
        title: 'Active Users',
        value: summary?.activeUsers,
        icon: 'person',
      },

      {
        title: 'Inactive Users',
        value: summary?.inActiveUsers,
        icon: 'person_off',
      },

      {
        title: 'Admins',
        value: summary?.admins,
        icon: 'admin_panel_settings',
      },
    ];
  }
}
