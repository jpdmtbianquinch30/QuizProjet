import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionDTO } from './questionnaire';

export interface IaGenerationRequest {
  theme: string;
  nombreQuestions: number;
  niveau: string;
}

export interface IaGenerationResponse {
  questions: QuestionDTO[];
}

@Injectable({ providedIn: 'root' })
export class IaService {

  private API = 'http://localhost:8080/api/ia';

  constructor(private http: HttpClient) {}

  genererQuestions(request: IaGenerationRequest): Observable<IaGenerationResponse> {
    return this.http.post<IaGenerationResponse>(`${this.API}/generer`, request);
  }
}