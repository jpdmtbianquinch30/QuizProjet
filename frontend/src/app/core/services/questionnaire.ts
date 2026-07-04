import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuestionnaireRequest,
  QuestionnaireResponse,
} from '../models/quiz';

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