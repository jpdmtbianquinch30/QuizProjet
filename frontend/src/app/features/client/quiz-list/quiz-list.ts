import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionnaireResponse, ScoreResponse } from '../../../core/models/quiz';
import { QuizService } from '../../../core/services/quiz';


@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss',
})
export class QuizList implements OnInit {
  questionnaires: QuestionnaireResponse[] = [];
  historique: ScoreResponse[] = [];
  chargement = true;
  erreur = '';

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.quizService.getQuestionnairesAssignes().subscribe({
      next: (data) => {
        this.questionnaires = data;
        this.chargerHistorique();
      },
      error: () => {
        this.erreur = 'Impossible de charger vos questionnaires.';
        this.chargement = false;
      },
    });
  }

  private chargerHistorique(): void {
    this.quizService.getMonHistorique().subscribe({
      next: (data) => {
        this.historique = data;
        this.chargement = false;
      },
      error: () => {
        this.chargement = false;
      },
    });
  }

  dejaComplete(questionnaireId: number): boolean {
    return this.historique.some((s) => s.questionnaireId === questionnaireId);
  }

  scoreObtenu(questionnaireId: number): ScoreResponse | undefined {
    return this.historique.find((s) => s.questionnaireId === questionnaireId);
  }

  demarrer(id: number): void {
    if (this.dejaComplete(id)) return;
    this.router.navigate(['/client/jouer', id]);
  }

  retour(): void {
    this.router.navigate(['/client']);
  }
}