import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  login(credentials: any): Observable<any>{
    return this.http.post(
       'http://localhost:5000/api/auth/login',
       credentials
    )
  }

  saveToken(token: string): void{
    localStorage.setItem('token', token)
  }

  getToken(): string | null{
    return localStorage.getItem('token')
  }

  saveUser(user: any): void{
    localStorage.setItem('user', JSON.stringify(user))
  }

  getCurrentUser(){
    const user = localStorage.getItem('user')
    return user? JSON.parse(user): null
  }

  isLoggedIn(){
    return !!this.getToken()
  }

  logout(){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}
