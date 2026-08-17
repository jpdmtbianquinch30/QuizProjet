import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionnaireResponse } from '../models/quiz';

export interface StatistiquesResponse {
  totalApprenants: number;
  totalEvaluateurs: number;
  totalQuestionnaires: number;
  totalQuestionnairesPublies: number;
  tauxReussiteGlobal: number;
}

export interface ApprenantStatResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  scoreMoyen: number;
  quizCompletes: number;
  totalQuizAssignes: number;
}

export interface EvaluateurStatResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  quizCrees: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {

  private API = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  statistiques(): Observable<StatistiquesResponse> {
    return this.http.get<StatistiquesResponse>(`${this.API}/statistiques`);
  }

  apprenants(): Observable<ApprenantStatResponse[]> {
    return this.http.get<ApprenantStatResponse[]>(`${this.API}/apprenants`);
  }

  evaluateurs(): Observable<EvaluateurStatResponse[]> {
    return this.http.get<EvaluateurStatResponse[]>(`${this.API}/evaluateurs`);
  }

  changerStatut(userId: number): Observable<{ actif: boolean }> {
    return this.http.put<{ actif: boolean }>(`${this.API}/utilisateurs/${userId}/statut`, {});
  }

 questionnaires(): Observable<QuestionnaireResponse[]> {
  return this.http.get<QuestionnaireResponse[]>(`${this.API}/questionnaires`);
}

  archiverQuestionnaire(questionnaireId: number): Observable<QuestionnaireResponse> {
    return this.http.put<QuestionnaireResponse>(`${this.API}/questionnaires/${questionnaireId}/archiver`, {});
  }
}
