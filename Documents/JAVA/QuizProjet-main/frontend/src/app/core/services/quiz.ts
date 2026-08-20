import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionnaireResponse, SoumissionRequest } from '../models/quiz';

import { ScoreResponse } from './score';


@Injectable({ providedIn: 'root' })
export class QuizService {

  private API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getQuestionnairesAssignes(): Observable<QuestionnaireResponse[]> {
    return this.http.get<QuestionnaireResponse[]>(
      `${this.API}/questionnaires/assignes`
    );
  }

  getQuestionnairePourJeu(id: number): Observable<QuestionnaireResponse> {
    return this.http.get<QuestionnaireResponse>(
      `${this.API}/questionnaires/${id}/jouer`
    );
  }

  verifierReponse(questionId: number, choixIndex: number): Observable<{ correcte: boolean; bonneReponseIndex: number }> {
    return this.http.post<{ correcte: boolean; bonneReponseIndex: number }>(
      `${this.API}/questions/${questionId}/verifier`,
      { choixIndex }
    );
  }

  soumettre(request: SoumissionRequest): Observable<ScoreResponse> {
    return this.http.post<ScoreResponse>(`${this.API}/scores`, request);
  }

  getMonHistorique(): Observable<ScoreResponse[]> {
    return this.http.get<ScoreResponse[]>(`${this.API}/scores/mon-historique`);
  }
}