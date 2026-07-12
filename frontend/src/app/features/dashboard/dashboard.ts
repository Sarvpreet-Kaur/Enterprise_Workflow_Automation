import { Component, inject, OnInit, ChangeDetectorRef, signal } from '@angular/core';
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

  msg = signal<string>('')

  ngOnInit(): void {

    

  }
}
