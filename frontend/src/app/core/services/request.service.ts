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
export class RequestService {
  private apiUrl = `${environment.apiUrl}/requests`;
  constructor(private http: HttpClient) {}

  getRequests(params?: Record<string, string | number>) {
    return this.http.get<RequestResponse>(this.apiUrl, { params });
  }

  getRequestById(id: string) {
    return this.http.get<ApiResponse<Request>>(`${this.apiUrl}/${id}`);
  }

  createRequest(request: CreateRequest) {
    return this.http.post<ApiResponse<Request>>(this.apiUrl, request);
  }

  updateRequest(id: string, request: UpdateRequest) {
    return this.http.put<ApiResponse<Request>>(`${this.apiUrl}/${id}`, request);
  }

  submitRequest(id: string) {
    return this.http.patch<ApiResponse<Request>>(`${this.apiUrl}/${id}/submit`, {});
  }

  cancelRequest(id: string) {
    return this.http.patch<ApiResponse<Request>>(`${this.apiUrl}/${id}/cancel`, {});
  }

}
