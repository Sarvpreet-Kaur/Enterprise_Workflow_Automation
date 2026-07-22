import { Component, effect, input } from '@angular/core';
import { RecentRequest } from '../../../../core/models/recent-requests.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recent-requests',
  imports: [MatIconModule],
  templateUrl: './recent-requests.html',
  styleUrl: './recent-requests.css',
})
export class RecentRequests {
  requests = input.required<RecentRequest[]>();
  constructor(){
    effect(()=>{
      console.log(this.requests());
    });
  }

  getStatusClass(status: string): string {

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
}
