import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import jwtDecode from 'jwt-decode'; // ✅ Import correct



export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
  const token = localStorage.getItem('jwt_token'); // ✅ cohérent
  return !!token;
}


  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5211/api/Auth'; // Ton backend

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
// auth.service.ts (assure-toi baseUrl correct)
forgotPassword(email: string) {
  return this.http.post<{ message?: string }>(`${this.baseUrl}/forgot-password`, { email });
}

resetPassword(token: string, newPassword: string) {
  return this.http.post<{ message?: string }>(`${this.baseUrl}/reset-password`, { token, newPassword });
}

 getRole(): string | null {
    return localStorage.getItem('role');
  }



}
