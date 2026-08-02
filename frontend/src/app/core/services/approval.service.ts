import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { ApiResponse } from '../models/api-response.model';
import { RequestResponse } from '../models/requestResponse.model';
import { Request } from '../models/request.model';
import { CreateRequest } from '../models/createRequest.model';
import { UpdateRequest } from '../models/updateRequest.model';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  private apiUrl = `${environment.apiUrl}/requests`;
  constructor(private http: HttpClient) {}

  getPendingRequests(params?: Record<string, string | number>) {
    return this.http.get<RequestResponse>(`${this.apiUrl}/pending`, { params });
  }

  approveRequest(id: string, comments: string) {
    return this.http.patch<ApiResponse<Request>>(`${this.apiUrl}/${id}/approve`, {
      comments,
    });
  }
  
  rejectRequest(id: string, comments: string) {
    return this.http.patch<ApiResponse<Request>>(`${this.apiUrl}/${id}/reject`, {
      comments,
    });
  }
}
