import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuestionDTO {
  id?: number;
  contenu: string;
  choix: string[];
  bonneReponseIndex: number;
  points: number;
  ordre: number;
}

export interface QuestionnaireRequest {
  titre: string;
  description: string;
  theme: string;
  dureeSecondes: number;
  statut: string;
  questions: QuestionDTO[];
}

export interface QuestionnaireResponse {
  id: number;
  titre: string;
  description: string;
  theme: string;
  dureeSecondes: number;
  statut: string;
  createdAt: string;
  updatedAt: string;
  createdByNom: string;
  nombreQuestions: number;
  questions: QuestionDTO[];
}

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {

  private API = 'http://localhost:8080/api/questionnaires';

  constructor(private http: HttpClient) {}

  listerTous(): Observable<QuestionnaireResponse[]> {
    return this.http.get<QuestionnaireResponse[]>(this.API);
  }

  afficher(id: number): Observable<QuestionnaireResponse> {
    return this.http.get<QuestionnaireResponse>(`${this.API}/${id}`);
  }

  creer(request: QuestionnaireRequest): Observable<QuestionnaireResponse> {
    return this.http.post<QuestionnaireResponse>(this.API, request);
  }

  modifier(id: number, request: QuestionnaireRequest): Observable<QuestionnaireResponse> {
    return this.http.put<QuestionnaireResponse>(`${this.API}/${id}`, request);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}