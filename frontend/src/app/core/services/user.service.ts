import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { UserResponse } from '../models/userResponse.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUsers(params?:  Record<string, string | number>) {
    return this.http.get<UserResponse>(this.apiUrl, { params });
  }

  // getUserById(id: string): Observable<ApiResponse<User>> {
  //   return this.http.get<any>(`${this.apiUrl}/${id}`);
  // }

  // createUser(user: User): Observable<ApiResponse<User>> {
  //   return this.http.post<any>(this.apiUrl, user);
  // }

  // updateUser(id: string, user: User): Observable<ApiResponse<User>> {
  //   return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  // }

  // changeUserStatus(id: string, status: boolean): Observable<ApiResponse<User>> {
  //   return this.http.patch<any>(`${this.apiUrl}/${id}/${status}`, {});
  // }

  // deleteUser(id: string): Observable<ApiResponse<User>> {
  //   return this.http.delete<any>(`${this.apiUrl}/${id}`);
  // }
}
