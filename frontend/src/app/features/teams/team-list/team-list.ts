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
import { UserForm } from '../../user-management/user-form/user-form';
import { FilterOption } from '../../../core/models/filterOption.model';
import { AlertService } from '../../../core/services/alert.service';
import { TeamForm } from '../team-form/team-form';

@Component({
  selector: 'app-team-list',
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
    MatDialogModule,
  ],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList implements OnInit {
  teams: Team[] = [];
  searchControl = new FormControl('', { nonNullable: true });

  teamFilters: FilterConfig[] = [];
  isTeamsLoading = false;

  displayedColumns = ['name', 'department', 'manager', 'admin', 'status', 'actions'];
  currentPage = 1;
  pageSize = 5;
  pagination: Pagination = {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 0,
    pageSize: this.pageSize,
  };

  selectedFilters: Record<string, string> = {};
  @ViewChild('filterBar') filterBar!: FilterBar;

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private teamService = inject(TeamService);
  private alertService = inject(AlertService);

  ngOnInit() {
    this.loadTeams();
    this.listenSearch();
  }

  addTeam() {
    const dialogRef = this.dialog.open(TeamForm, {
      width: '900px',
      disableClose: true,
      data: {}
      
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTeams();
      }
    });
  }

  editTeam(team: Team) {
    const dialogRef = this.dialog.open(TeamForm, {
      width: '900px',
      disableClose: true,
      data: {
        isEdit: true,
        team,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.loadTeams();
        });
      }
    });
  }

  async deleteTeam(team: Team) {
    if (!team.isActive) {
      return;
    }

    const result = await this.alertService.confirm(
      'Delete Team',

      `Are you sure you want to delete ${team.name}?`,
    );

    if (!result.isConfirmed) {
      return;
    }
    const id = team._id!;
    this.teamService.deleteTeam(id).subscribe({
      next: () => {
        this.alertService.success(
          'Deleted',

          'Team deleted successfully.',
        );

        this.loadTeams();
      },

      error: (err) => {
        this.alertService.error(
          'Delete Failed',

          err.error.message,
        );
      },
    });
  }
  listenSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadTeams();
      });
  }

  buildFilters() {
    this.teamFilters = [
      {
        key: 'status',
        label: 'Status',
        options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ],
      },

      {
        key: 'department',
        label: 'Department',
        options: [
          { label: 'Engineering', value: 'Engineering' },
          { label: 'HR', value: 'HR' },
          { label: 'Finance', value: 'Finance' },
          { label: 'Operations', value: 'Operations' },
          { label: 'IT', value: 'IT' },
        ],
      },
    ];
  }

  onFiltersChanged(filters: Record<string, string>) {
    this.selectedFilters = filters;
    this.currentPage = 1;
    this.loadTeams();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadTeams();
  }

  resetFilters() {
    this.searchControl.setValue('');

    this.filterBar.resetFilters();

    this.currentPage = 1;
    this.selectedFilters = {};

    this.loadTeams();
  }

  loadTeams(): void {
    this.isTeamsLoading = true;
    this.teamService.getTeams({
      search: this.searchControl.value,
        page: this.currentPage,
        limit: this.pageSize,
        ...this.selectedFilters,
    }).subscribe({
      next: (response) => {
        this.teams = response.data;
        // console.log(this.teams)
        this.buildFilters();
        this.isTeamsLoading = false;
        this.pagination = response.pagination
        this.cdr.detectChanges()
      },
      error: () => {
        this.isTeamsLoading = false;
      },
    });
  }
}
