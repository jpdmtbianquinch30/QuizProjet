import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProfilResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

export interface ProfilUpdateRequest {
  nom: string;
  prenom: string;
}

export interface ChangerMotDePasseRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

@Injectable({ providedIn: 'root' })
export class ProfilService {

  private API = 'http://localhost:8080/api/profil';

  constructor(private http: HttpClient) {}

  voirProfil(): Observable<ProfilResponse> {
    return this.http.get<ProfilResponse>(this.API);
  }

  modifierProfil(request: ProfilUpdateRequest): Observable<ProfilResponse> {
    return this.http.put<ProfilResponse>(this.API, request);
  }

  changerMotDePasse(request: ChangerMotDePasseRequest): Observable<string> {
    return this.http.put(`${this.API}/mot-de-passe`, request, { responseType: 'text' });
  }
}