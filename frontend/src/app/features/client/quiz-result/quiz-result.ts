import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScoreResponse } from '../../../core/models/quiz';


@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result.html',
  styleUrl: './quiz-result.scss',
})
export class QuizResult implements OnInit {
  score: ScoreResponse | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation?.();
    const state = history.state;
    this.score = state?.score ?? null;

    if (!this.score) {
      this.router.navigate(['/client/quiz-list']);
    }
  }

  retour(): void {
    this.router.navigate(['/client/liste']);
  }
}