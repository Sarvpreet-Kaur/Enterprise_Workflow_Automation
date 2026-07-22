import { Component, input } from '@angular/core';
import { SystemOverviewModel } from '../../../../core/models/systemOverview.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-system-overview',
  imports: [MatIconModule],
  templateUrl: './system-overview.html',
  styleUrl: './system-overview.css',
})
export class SystemOverview {
  system = input.required<SystemOverviewModel>();
}
