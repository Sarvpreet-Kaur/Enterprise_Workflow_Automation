import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { AuthService } from '../../../../core/services/auth.service';
import { RecentRequest } from '../../../../core/models/recent-requests.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-approvals',
  imports: [MatIconModule, DatePipe, CommonModule, EmptyState],
  templateUrl: './pending-approvals.html',
  styleUrl: './pending-approvals.css',
})
export class PendingApprovals {
  private authService = inject(AuthService)
  private router = inject(Router)

  approvals = input.required<RecentRequest[]>()

  role = this.authService.getCurrentUserRole()

  viewAll(){
    this.router.navigate(['/approvals']);
  }
  review(){
    this.router.navigate(['/approvals']);
  }
}
