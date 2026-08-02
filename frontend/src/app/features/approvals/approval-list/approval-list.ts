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
import { FilterOption } from '../../../core/models/filterOption.model';
import { AlertService } from '../../../core/services/alert.service';
import { RequestService } from '../../../core/services/request.service';
import { Request } from '../../../core/models/request.model';
import { Workflow } from '../../../core/models/workflow.model';
import { WorkflowService } from '../../../core/services/workflow.service';
import { RequestDetails } from '../../requests/request-details/request-details';
import Swal from 'sweetalert2';
import { ApprovalService } from '../../../core/services/approval.service';

@Component({
  selector: 'app-approval-list',
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
  templateUrl: './approval-list.html',
  styleUrl: './approval-list.css',
})
export class ApprovalList implements OnInit {
  isRequestLoading = false;
  isTeamsLoading = false;
  isWorkflowLoading = false;
  requests: Request[] = [];
  teams: Team[] = [];
  workflows: Workflow[] = [];
  workflowFilterOptions: FilterOption[] = [];

  searchControl = new FormControl('', { nonNullable: true });
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
  requestFilters: FilterConfig[] = [];

  displayedColumns = [
    'title',
    'requestedBy',
    'workflow',
    'team',
    'priority',
    'submitted',
    'actions',
  ];

  private requestService = inject(RequestService);
  private teamService = inject(TeamService);
  private approvalService = inject(ApprovalService)
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private workflowService = inject(WorkflowService);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.listenSearch();
    this.loadRequests();
    this.loadWorkflows();
  }

  loadRequests(): void {
    this.isRequestLoading = true;
    console.log('here');
    this.approvalService
      .getPendingRequests({
        search: this.searchControl.value,
        page: this.currentPage,
        limit: this.pageSize,
        ...this.selectedFilters,
      })
      .subscribe({
        next: (response) => {
          this.requests = response.data;
          this.pagination = response.pagination;
          this.isRequestLoading = false;
          console.log(this.requests)
          this.cdr.detectChanges();
        },
        error: () => {
          this.isRequestLoading = false;
        },
      });
  }

  listenSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadRequests();
      });
  }

  buildFilters() {
    this.requestFilters = [
      {
        key: 'priority',
        label: 'Priority',
        options: [
          { label: 'High', value: 'High' },
          { label: 'Medium', value: 'Medium' },
          { label: 'Low', value: 'Low' },
        ],
      },

      {
        key: 'workflow',
        label: 'Workflow',
        options: this.workflowFilterOptions,
      },
    ];
  }

  loadWorkflows(): void {
    this.isWorkflowLoading = true;
    this.workflowService.getWorkflows().subscribe({
      next: (response) => {
        this.workflows = response.data.filter((workflow) => workflow.isActive);
        this.buildWorkflowFilters();
        this.buildFilters();
        this.isWorkflowLoading = false;
      },
      error: () => {
        this.isWorkflowLoading = false;
      },
    });
  }

  buildWorkflowFilters() {
    this.workflowFilterOptions = this.workflows?.map((workflow) => ({
      label: workflow?.name,
      value: workflow?._id,
    }));
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadRequests();
  }

  onFiltersChanged(filters: Record<string, string>) {
    this.selectedFilters = filters;
    this.currentPage = 1;
    this.loadRequests();
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.filterBar.resetFilters();
    this.currentPage = 1;
    this.selectedFilters = {};
    this.loadRequests();
  }

  viewRequest(request: Request) {
    this.dialog.open(RequestDetails, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        requestId: request._id,
      },
    });
  }

  approveRequest(request: Request) {
    Swal.fire({
      title: 'Approve Request',

      text: 'Please provide approval comments.',

      input: 'textarea',

      inputPlaceholder: 'Enter approval comments...',

      inputAttributes: {
        maxlength: '500',
      },

      showCancelButton: true,

      confirmButtonText: 'Approve',

      confirmButtonColor: '#2E8B57',

      inputValidator: (value) => {
        if (!value?.trim()) {
          return 'Comments are required.';
        }

        return null;
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.approvalService
        .approveRequest(request._id, result.value.trim())
        .subscribe({
          next: () => {
            this.alertService.success(
              'Request Approved',
              'The request has been approved successfully.',
            );

            this.loadRequests();
          },

          error: (err) => {
            this.alertService.error('Approval Failed', err.error.message);
          },
        });
    });
  }

  rejectRequest(request: Request) {
    Swal.fire({
      title: 'Reject Request',

      text: 'Please provide rejection comments.',

      input: 'textarea',

      inputPlaceholder: 'Enter rejection comments...',

      inputAttributes: {
        maxlength: '500',
      },

      showCancelButton: true,

      confirmButtonText: 'Reject',

      confirmButtonColor: '#D9534F',

      inputValidator: (value) => {
        if (!value?.trim()) {
          return 'Comments are required.';
        }

        return null;
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.approvalService
        .rejectRequest(request._id, result.value.trim())
        .subscribe({
          next: () => {
            this.alertService.success(
              'Request Rejected',
              'The request has been rejected successfully.',
            );

            this.loadRequests();
          },

          error: (err) => {
            this.alertService.error('Rejection Failed', err.error.message);
          },
        });
    });
  }
}
