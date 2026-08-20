import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin';
import { QuestionnaireResponse } from '../../../core/models/quiz';

@Component({
  selector: 'app-manage-questionnaires',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-questionnaires.html',
  styleUrl: './manage-questionnaires.scss'
})
export class ManageQuestionnairesComponent implements OnInit {
  questionnaires: QuestionnaireResponse[] = [];
  chargement = true;
  erreur = '';
  idEnCours: number | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.charger(); }

  charger(): void {
    this.chargement = true;
    this.erreur = '';
    this.adminService.questionnaires().subscribe({
      next: data => { this.questionnaires = data; this.chargement = false; },
      error: () => { this.erreur = 'Impossible de charger les questionnaires.'; this.chargement = false; }
    });
  }

  archiver(questionnaire: QuestionnaireResponse): void {
    if (questionnaire.statut === 'ARCHIVE' || !confirm(`Archiver « ${questionnaire.titre} » ?`)) return;
    this.idEnCours = questionnaire.id;
    this.erreur = '';
    this.adminService.archiverQuestionnaire(questionnaire.id).subscribe({
      next: reponse => { questionnaire.statut = reponse.statut; this.idEnCours = null; },
      error: (err) => {
  console.error('Erreur chargement questionnaires admin :', err.status, err.message);
  this.erreur = `Impossible de charger les questionnaires (${err.status}).`;
  this.chargement = false;
}
    });
  }
}
