import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Questionnaire {
  id: number;
  titre: string;
  theme: string;
  statut: string; // PUBLIE | BROUILLON | ARCHIVE
  creePar: string;
  dateCreation: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireAdminService {

  private apiUrl = 'http://localhost:8080/api/questionnaires';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(this.apiUrl);
  }

  getByStatut(statut: string): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(
      `${this.apiUrl}/statut/${statut}`
    );
  }

  searchByTheme(theme: string): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(
      `${this.apiUrl}/recherche?theme=${theme}`
    );
  }

  archiver(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/archiver`, {});
  }

  restaurer(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/restaurer`, {});
  }

  getArchives(): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(`${this.apiUrl}/archives`);
  }
}