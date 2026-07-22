import { Component, effect, inject, input } from '@angular/core';
import { RecentRequest } from '../../../../core/models/recent-requests.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-requests',
  imports: [MatIconModule, DatePipe, CommonModule, EmptyState],
  templateUrl: './recent-requests.html',
  styleUrl: './recent-requests.css',
})
export class RecentRequests {
  private authService = inject(AuthService);
  private router = inject(Router);

  requests = input.required<RecentRequest[]>();

  role = this.authService.getCurrentUserRole();
  constructor() {}

  getStatusClass(status: string): string {
    console.log(this.requests);
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';

      case 'pending':
        return 'status-pending';

      case 'rejected':
        return 'status-rejected';

      case 'cancelled':
        return 'status-cancelled';

      default:
        return 'status-default';
    }
  }

  viewAll() {
    this.router.navigate(['/requests']);
  }
}
