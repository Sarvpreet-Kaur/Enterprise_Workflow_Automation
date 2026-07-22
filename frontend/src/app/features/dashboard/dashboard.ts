import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.services';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { DashboardResponse } from '../../core/models/dashboard.model';
import { DashboardCard } from '../../core/models/dashboardCard.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { RecentRequests } from './components/recent-requests/recent-requests';
import { Router } from '@angular/router';
import { PendingApprovals } from './components/pending-approvals/pending-approvals';
import { SystemOverview } from './components/system-overview/system-overview';
@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, StatCard, RecentRequests, PendingApprovals, SystemOverview],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService)
  private authService = inject(AuthService)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)

  dashboard!: DashboardResponse;
  cards: DashboardCard[] = [];


  user = this.authService.getCurrentUser();
  role = this.authService.getCurrentUserRole();
  currentDate = new Date();

  ngOnInit(): void {
    console.log("before api")
    this.dashboardService.getDashboard().subscribe((response) => {
      console.log(response.data)
      this.dashboard = response.data;
      console.log(this.dashboard);
      console.log("after api")
      this.buildCards();
      this.cdr.detectChanges();
    });
  }

  private buildCards(): void {
    console.log("in")
    console.log(this.authService.getCurrentUserRole())
    switch (this.role) {
    case 'employee':
      this.cards = [
          {
            title: 'Drafts',
            value: this.dashboard.summary.drafts || 0,
            icon: 'drafts'
          },
          {
            title: 'Pending',
            value: this.dashboard.summary.pending,
            icon: 'pending_actions'
          },
          {
            title: 'Approved',
            value: this.dashboard.summary.approved,
            icon: 'task_alt'
          },
          {
            title: 'Rejected',
            value: this.dashboard.summary.rejected,
            icon: 'cancel'
          }
      ];
      break;

    case 'manager':
      this.cards = [
        {
          title: 'Pending Approvals',
          value: this.dashboard.pendingApprovals?.count || 0,
          icon: 'assignment'
        },
        {
          title: 'Pending',
          value: this.dashboard.summary.pending,
          icon: 'pending_actions'
        },
        {
          title: 'Approved',
          value: this.dashboard.summary.approved,
          icon: 'task_alt'
        },
        {
          title: 'Rejected',
          value: this.dashboard.summary.rejected,
          icon: 'cancel'
        }
      ];
      break;

    case 'admin':
      console.log("admin")
      this.cards = [
        {
          title: 'Users',
          value: this.dashboard.system?.users || 0,
          icon: 'group'
        },
        {
          title: 'Teams',
          value: this.dashboard.system?.teams || 0,
          icon: 'groups'
        },
        {
          title: 'Workflows',
          value: this.dashboard.system?.workflows || 0,
          icon: 'account_tree'
        },
        {
          title: 'Pending',
          value: this.dashboard.summary.pending,
          icon: 'pending_actions'
      }];
      break;
    }
    console.log("out")
    console.log(this.cards)
  }

}
