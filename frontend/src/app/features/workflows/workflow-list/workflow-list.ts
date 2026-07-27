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
import { WorkflowService } from '../../../core/services/workflow.service';
import { Workflow } from '../../../core/models/workflow.model';
import { WorkflowForm } from '../workflow-form/workflow-form';

@Component({
  selector: 'app-workflow-list',
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
  templateUrl: './workflow-list.html',
  styleUrl: './workflow-list.css',
})
export class WorkflowList implements OnInit {
  workflows: Workflow[] = [];

  searchControl = new FormControl('', { nonNullable: true });

  isWorkflowLoading = false;

  currentPage = 1;
  pageSize = 5;
  pagination: Pagination = {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 0,
    pageSize: this.pageSize,
  };

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private teamService = inject(TeamService);
  private alertService = inject(AlertService);
  private workflowService = inject(WorkflowService);

  ngOnInit(): void {
    this.listenSearch();
    this.loadWorkflows();
  }

  listenSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadWorkflows();
      });
  }

  addWorkflow() {
    const dialogRef = this.dialog.open(WorkflowForm, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true,
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadWorkflows();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadWorkflows();
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.currentPage = 1;
    this.loadWorkflows();
  }

  editWorkflow(workflow: Workflow) {
    // const dialogRef = this.dialog.open(TeamForm, {
    //   width: '900px',
    //   disableClose: true,
    //   data: {
    //     isEdit: true,
    //     team,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     setTimeout(() => {
    //       this.loadTeams();
    //     });
    //   }
    // });
  }

  async deleteWorkflow(workflow: Workflow) {
    // if (!team.isActive) {
    //   return;
    // }

    // const result = await this.alertService.confirm(
    //   'Delete Team',

    //   `Are you sure you want to delete ${team.name}?`,
    // );

    // if (!result.isConfirmed) {
    //   return;
    // }
    // const id = team._id!;
    // this.teamService.deleteTeam(id).subscribe({
    //   next: () => {
    //     this.alertService.success(
    //       'Deleted',

    //       'Team deleted successfully.',
    //     );

    //     this.loadTeams();
    //   },

    //   error: (err) => {
    //     this.alertService.error(
    //       'Delete Failed',

    //       err.error.message,
    //     );
    //   },
    // });
  }

  loadWorkflows(): void {
    this.isWorkflowLoading = true;
    this.workflowService
      .getWorkflows({
        search: this.searchControl.value,
        page: this.currentPage,
        limit: this.pageSize,
      })
      .subscribe({
        next: (response) => {
          this.workflows = response.data;
          console.log(this.workflows)
          this.isWorkflowLoading = false;
          this.pagination = response.pagination;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isWorkflowLoading = false;
        },
      });
  }
}
