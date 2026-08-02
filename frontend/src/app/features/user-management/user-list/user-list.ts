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
import { Team } from '../../../core/models/teams.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeamService } from '../../../core/services/teams.services';
import { UserForm } from '../user-form/user-form';
import { FilterOption } from '../../../core/models/filterOption.model';
import { AlertService } from '../../../core/services/alert.service';

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
    StatCard,
    MatDialogModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  users: User[] = [];
  teams: Team[] = [];
  teamFilterOptions: FilterOption[] = [];

  isUsersLoading = false;
  isTeamsLoading = false;
  displayedColumns = ['name', 'email', 'role', 'teams', 'status', 'actions'];
  currentPage = 1;
  pageSize = 5;
  pagination: Pagination = {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 0,
    pageSize: this.pageSize,
  };
  userFilters: FilterConfig[] = [];
  cards: DashboardCard[] = [];
  searchControl = new FormControl('', { nonNullable: true });
  selectedFilters: Record<string, string> = {};
  @ViewChild('filterBar') filterBar!: FilterBar;

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private teamService = inject(TeamService);
  private alertService = inject(AlertService)

  ngOnInit() {
    this.loadUsers();
    this.listenSearch();
    this.loadTeams();
  }

  addUser() {
    const dialogRef = this.dialog.open(UserForm, {
      width: '900px',
      disableClose: true,

      data: {
        teams: this.teams,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: User) {
    if(!user.isActive){
      return;
    }
    const dialogRef = this.dialog.open(UserForm, {
      width: '900px',

      disableClose: true,

      data: {
        isEdit: true,

        user,

        teams: this.teams,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.loadUsers();
        });
      }
    });
  }

  loadUsers(): void {
    this.isUsersLoading = true;
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
          this.isUsersLoading = false;

          console.log(this.users);
          this.cdr.detectChanges();
        },
        error: () => {
          this.isUsersLoading = false;
        },
      });
  }

  loadTeams(): void {
    this.isTeamsLoading = true;
    this.teamService.getTeams().subscribe({
      next: (response) => {
        this.teams = response.data.filter((team) => team.isActive);;
        this.buildTeamFilters();
        this.buildFilters();
        this.isTeamsLoading = false;
      },
      error: () => {
        this.isTeamsLoading = false;
      },
    });
  }

  buildTeamFilters() {
    this.teamFilterOptions = this.teams?.map((team) => ({
      label: team?.name,
      value: team?._id,
    }));
  }

  buildFilters() {
    this.userFilters = [
      {
        key: 'role',
        label: 'Role',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'Manager', value: 'manager' },
          { label: 'Employee', value: 'employee' },
        ],
      },

      {
        key: 'status',
        label: 'Status',
        options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ],
      },

      {
        key: 'teams',
        label: 'Team',
        options: this.teamFilterOptions,
      },
    ];
  }

  listenSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
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

  buildCards(summary: {
    totalUsers: number;
    activeUsers: number;
    inActiveUsers: number;
    admins: number;
  }) {
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

  async deleteUser(user: User) {
    if(!user.isActive){
      return;
    }

    const result = await this.alertService.confirm(

        'Delete User',

        `Are you sure you want to delete ${user.firstName}?`

    );

    if (!result.isConfirmed) {

        return;

    }
    const id = user._id!
    this.userService.deleteUser(id).subscribe({

        next: () => {

            this.alertService.success(

                'Deleted',

                'User deleted successfully.'

            );

            this.loadUsers();

        },

        error: (err) => {

            this.alertService.error(

                'Delete Failed',

                err.error.message

            );

        }

    });

}
}
