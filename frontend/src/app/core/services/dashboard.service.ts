import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environment';
import { DashboardResponse } from '../models/dashboard.model';
import { ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})

export class DashboardService{

  private http = inject(HttpClient)

  getDashboard() {
    return this.http.get<ApiResponse<DashboardResponse>>(`${environment.apiUrl}/dashboard`);
  }
}
