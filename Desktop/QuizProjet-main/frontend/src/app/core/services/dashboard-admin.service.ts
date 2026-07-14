import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  utilisateurs: number;
  evaluateurs: number;
  questionnaires: number;
  archives: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardAdminService {

  private apiUrl = 'http://localhost:8080/api/admin/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}