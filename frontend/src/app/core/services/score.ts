import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ScoreResponse {
  id: number;
  utilisateurId: number;
  utilisateurNom: string;
  utilisateurPrenom: string;
  questionnaireId: number;
  questionnaireTitre: string;
  scoreObtenu: number;
  scoreMax: number;
  pourcentage: number;
  dateSoumission: string;
}

@Injectable({ providedIn: 'root' })
export class ScoreService {

  private API = 'http://localhost:8080/api/scores';

  constructor(private http: HttpClient) {}

  classement(questionnaireId: number): Observable<ScoreResponse[]> {
    return this.http.get<ScoreResponse[]>(`${this.API}/classement/${questionnaireId}`);
  }

  monHistorique(): Observable<ScoreResponse[]> {
    return this.http.get<ScoreResponse[]>(`${this.API}/mon-historique`);
  }
}