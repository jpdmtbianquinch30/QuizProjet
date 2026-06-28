import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionnaireService, QuestionnaireResponse } from '../../../core/services/questionnaire';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-questionnaire-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questionnaire-list.html',
  styleUrl: './questionnaire-list.scss'
})
export class QuestionnaireListComponent implements OnInit {

  questionnaires: QuestionnaireResponse[] = [];
  chargement = true;
  erreur = '';

  constructor(
    private questionnaireService: QuestionnaireService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.questionnaireService.listerTous().subscribe({
      next: (data) => {
        this.questionnaires = data;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement';
        this.chargement = false;
      }
    });
  }

  nouveau(): void {
    this.router.navigate(['/admin/questionnaires/nouveau']);
  }

  modifier(id: number): void {
    this.router.navigate(['/admin/questionnaires/modifier', id]);
  }

  supprimer(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      this.questionnaireService.supprimer(id).subscribe({
        next: () => this.charger(),
        error: () => this.erreur = 'Erreur lors de la suppression'
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  getNom(): string {
    return this.authService.getNom();
  }

  getStatutClass(statut: string): string {
    switch(statut) {
      case 'PUBLIE': return 'badge-publie';
      case 'BROUILLON': return 'badge-brouillon';
      case 'ARCHIVE': return 'badge-archive';
      default: return '';
    }
  }

  formatDuree(secondes: number): string {
    const min = Math.floor(secondes / 60);
    const sec = secondes % 60;
    return sec > 0 ? `${min}min ${sec}s` : `${min}min`;
  }
}