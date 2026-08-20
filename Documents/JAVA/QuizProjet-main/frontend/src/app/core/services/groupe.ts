import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApprenantDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface GroupeRequest {
  nom: string;
  description: string;
}

export interface GroupeResponse {
  id: number;
  nom: string;
  description: string;
  createdByNom: string;
  createdAt: string;
  questionnaireAssigneId: number | null;
  questionnaireAssigneTitre: string | null;
  apprenants: ApprenantDTO[];
}

@Injectable({ providedIn: 'root' })
export class GroupeService {

  private API = 'http://localhost:8080/api/groupes';

  constructor(private http: HttpClient) {}

  lister(): Observable<GroupeResponse[]> {
    return this.http.get<GroupeResponse[]>(this.API);
  }

  afficher(id: number): Observable<GroupeResponse> {
    return this.http.get<GroupeResponse>(`${this.API}/${id}`);
  }

  creer(request: GroupeRequest): Observable<GroupeResponse> {
    return this.http.post<GroupeResponse>(this.API, request);
  }

  modifier(id: number, request: GroupeRequest): Observable<GroupeResponse> {
    return this.http.put<GroupeResponse>(`${this.API}/${id}`, request);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  ajouterApprenants(id: number, emails: string[]): Observable<GroupeResponse> {
    return this.http.post<GroupeResponse>(`${this.API}/${id}/apprenants`, { emails });
  }

  retirerApprenant(id: number, apprenantId: number): Observable<GroupeResponse> {
    return this.http.delete<GroupeResponse>(`${this.API}/${id}/apprenants/${apprenantId}`);
  }

  assignerQuestionnaire(id: number, questionnaireId: number): Observable<GroupeResponse> {
    return this.http.put<GroupeResponse>(`${this.API}/${id}/questionnaire`, { questionnaireId });
  }
}