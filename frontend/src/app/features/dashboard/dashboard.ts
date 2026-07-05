import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../core/services/api.services';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private apiService = inject(ApiService)
  private cdr = inject(ChangeDetectorRef);

  msg = 'hello'

  ngOnInit(): void {

    this.apiService.getHealth().subscribe({
      next: (response) => {
        console.log(response);
        this.msg = response.message;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });

  }
}
