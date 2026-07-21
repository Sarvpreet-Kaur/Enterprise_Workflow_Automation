import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Holds the logged-in user
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());

  // Components subscribe to this
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  private loadUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/employee/login`, credentials).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this.saveUser(response.user);
      }),
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));

    // Notify every subscriber
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Notify every subscriber
    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

  getFullName(): string {
    const user = this.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }
  
  getUserRole(): string {
    return this.getCurrentUser()?.role ?? '';
  }
}
