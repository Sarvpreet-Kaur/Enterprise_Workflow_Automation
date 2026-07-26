import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { TeamResponse } from '../models/teamsResponse.model';
import { Team } from '../models/teams.model';
import { ApiResponse } from '../models/api-response.model';
import { CreateTeam } from '../models/createTeam.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  getTeams(params?:  Record<string, string | number>) {
    return this.http.get<TeamResponse>(this.apiUrl, { params });
  }

  // getUserById(id: string) {
  //   return this.http.get<any>(`${this.apiUrl}/${id}`);
  // }

  createTeam(team: CreateTeam) {
    return this.http.post<ApiResponse<Team>>(this.apiUrl, team);
  }

  updateTeam(id: string, team: CreateTeam) {
    return this.http.put<ApiResponse<Team>>(`${this.apiUrl}/${id}`, team);
  }

  // changeUserStatus(id: string, status: boolean) {
  //   return this.http.patch<any>(`${this.apiUrl}/${id}/${status}`, {});
  // }

  deleteTeam(id: string) {
    return this.http.delete<ApiResponse<Team>>(`${this.apiUrl}/${id}`);
  }
}
