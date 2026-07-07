import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private http = inject(HttpClient);
    // private baseUrl = 'http://localhost:5000/api';
    constructor() {}

    getHealth(): Observable<any> {
        return this.http.get(`https://6a3f78a39b6d371e8380d9dd.mockapi.io/EMS/Employees/EMP001`, {
            withCredentials: false
        });
    }
}
