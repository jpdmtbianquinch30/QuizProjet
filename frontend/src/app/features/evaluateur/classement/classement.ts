import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ScoreService, ScoreResponse } from '../../../core/services/score';
import { QuestionnaireResponse } from '../../../core/models/quiz';
import { QuestionnaireService } from '../../../core/services/questionnaire';


@Component({
  selector: 'app-classement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classement.html',
  styleUrl: './classement.scss'
})
export class ClassementComponent implements OnInit {

  questionnaires: QuestionnaireResponse[] = [];
  questionnaireSelectionneId: number | null = null;

  scores: ScoreResponse[] = [];

  chargementQuestionnaires = true;
  chargementScores = false;
  erreur = '';

  constructor(
    private scoreService: ScoreService,
    private questionnaireService: QuestionnaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerQuestionnaires();
  }

  chargerQuestionnaires(): void {
    this.chargementQuestionnaires = true;
    this.questionnaireService.listerTous().subscribe({
      next: (data) => {
        this.questionnaires = data;
        this.chargementQuestionnaires = false;

        if (data.length > 0) {
          this.questionnaireSelectionneId = data[0].id;
          this.chargerClassement();
        }
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement des questionnaires';
        this.chargementQuestionnaires = false;
      }
    });
  }

  onChangementQuestionnaire(): void {
    if (this.questionnaireSelectionneId) {
      this.chargerClassement();
    }
  }

  chargerClassement(): void {
    if (!this.questionnaireSelectionneId) return;

    this.erreur = '';
    this.chargementScores = true;
    this.scores = [];

    this.scoreService.classement(this.questionnaireSelectionneId).subscribe({
      next: (data) => {
        this.scores = data;
        this.chargementScores = false;
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement du classement';
        this.chargementScores = false;
      }
    });
  }

  medaille(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  }

  retour(): void {
    this.router.navigate(['/evaluateur']);
  }
}