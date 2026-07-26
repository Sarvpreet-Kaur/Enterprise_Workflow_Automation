import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { TeamResponse } from '../models/teamsResponse.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  getTeams(params?:  Record<string, string | number>) {
    return this.http.get<TeamResponse>(this.apiUrl, { params });
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
