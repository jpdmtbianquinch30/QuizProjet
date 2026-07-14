import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UtilisateurResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
}

export interface CreateUserRequest {
  nom: string;
  prenom?: string;
  email: string;
  password?: string;
}

export interface UpdateUserRequest {
  nom: string;
  prenom?: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private API = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // ================= USERS =================

  getAllUsers(): Observable<UtilisateurResponse[]> {
    return this.http.get<UtilisateurResponse[]>(`${this.API}/utilisateurs`);
  }

  getUser(id: number): Observable<UtilisateurResponse> {
    return this.http.get<UtilisateurResponse>(`${this.API}/utilisateurs/${id}`);
  }

  updateUser(id: number, request: UpdateUserRequest) {
    return this.http.put(`${this.API}/utilisateurs/${id}`, request);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.API}/utilisateurs/${id}`);
  }

  activateUser(id: number) {
    return this.http.patch(`${this.API}/utilisateurs/${id}/activer`, {});
  }

  deactivateUser(id: number) {
    return this.http.patch(`${this.API}/utilisateurs/${id}/desactiver`, {});
  }

  resetPassword(id: number, password: string) {
    return this.http.put(
      `${this.API}/utilisateurs/${id}/reset-password`,
      { nouveauMotDePasse: password },
      { responseType: 'text' }
    );
  }

  createUser(request: CreateUserRequest) {
    return this.http.post(`${this.API}/users`, request);
  }

  createEvaluateur(request: CreateUserRequest) {
    return this.http.post(`${this.API}/evaluateurs`, request);
  }

  createAdmin(request: CreateUserRequest) {
    return this.http.post(`${this.API}/admins`, request);
  }
}