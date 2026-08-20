import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScoreResponse } from '../../../core/models/quiz';
import { QuizService } from '../../../core/services/quiz';


@Component({
  selector: 'app-quiz-historique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-historique.html',
  styleUrl: './quiz-historique.scss',
})
export class QuizHistorique implements OnInit {
  scores: ScoreResponse[] = [];
  chargement = true;
  erreur = '';

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.quizService.getMonHistorique().subscribe({
      next: (data) => {
        this.scores = data;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Impossible de charger votre historique.';
        this.chargement = false;
      },
    });
  }

  couleurScore(pourcentage: number): string {
    if (pourcentage >= 70) return '#059669';
    if (pourcentage >= 40) return '#d97706';
    return '#b91c1c';
  }

  retour(): void {
    this.router.navigate(['/client']);
  }
}