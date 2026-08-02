import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestService } from '../../../core/services/request.service';
import { Request } from '../../../core/models/request.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-request-details',
  imports: [DatePipe, CommonModule, MatIconModule],
  templateUrl: './request-details.html',
  styleUrl: './request-details.css',
})

export class RequestDetails implements OnInit {
  request: Request|null = null;
  isLoading = false;
  data = inject(MAT_DIALOG_DATA);

  private requestService = inject(RequestService);
  private cdr = inject(ChangeDetectorRef)
  dialogRef = inject(MatDialogRef<RequestDetails>);

  ngOnInit() {
    this.loadRequest();
  }

  loadRequest() {
    this.isLoading = true;

    this.requestService.getRequestById(this.data.requestId).subscribe({
      next: (response) => {
        this.request = response.data;

        this.isLoading = false;
        this.cdr.detectChanges()
      },

      error: () => {
        this.isLoading = false;
      },
    });
  }
}
