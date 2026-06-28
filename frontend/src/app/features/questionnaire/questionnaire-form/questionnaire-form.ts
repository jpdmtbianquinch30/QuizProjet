import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionnaireService, QuestionnaireRequest } from '../../../core/services/questionnaire';

@Component({
  selector: 'app-questionnaire-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questionnaire-form.html',
  styleUrl: './questionnaire-form.scss'
})
export class QuestionnaireFormComponent implements OnInit {

  isModification = false;
  id: number | null = null;
  chargement = false;
  erreur = '';
  succes = '';

  questionnaire: QuestionnaireRequest = {
    titre: '',
    description: '',
    theme: '',
    dureeSecondes: 300,
    statut: 'BROUILLON',
    questions: []
  };

  constructor(
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.isModification = true;
      this.chargerQuestionnaire();
    } else {
      this.ajouterQuestion();
    }
  }

  chargerQuestionnaire(): void {
    this.questionnaireService.afficher(this.id!).subscribe({
      next: (data) => {
        this.questionnaire = {
          titre: data.titre,
          description: data.description,
          theme: data.theme,
          dureeSecondes: data.dureeSecondes,
          statut: data.statut,
          questions: data.questions.map(q => ({
            contenu: q.contenu,
            choix: [...q.choix],
            bonneReponseIndex: q.bonneReponseIndex,
            points: q.points,
            ordre: q.ordre
          }))
        };
      },
      error: () => this.erreur = 'Erreur lors du chargement'
    });
  }

  ajouterQuestion(): void {
    this.questionnaire.questions.push({
      contenu: '',
      choix: ['', '', '', ''],
      bonneReponseIndex: 0,
      points: 1,
      ordre: this.questionnaire.questions.length + 1
    });
  }

  supprimerQuestion(index: number): void {
    this.questionnaire.questions.splice(index, 1);
    this.questionnaire.questions.forEach((q, i) => q.ordre = i + 1);
  }

  sauvegarder(): void {
    if (!this.valider()) return;
    this.chargement = true;
    this.erreur = '';

    const action = this.isModification
      ? this.questionnaireService.modifier(this.id!, this.questionnaire)
      : this.questionnaireService.creer(this.questionnaire);

    action.subscribe({
      next: () => {
        this.succes = this.isModification ? 'Modifié !' : 'Créé !';
        this.chargement = false;
        setTimeout(() => this.router.navigate(['/admin/questionnaires']), 1500);
      },
      error: () => {
        this.erreur = 'Erreur lors de la sauvegarde';
        this.chargement = false;
      }
    });
  }

  valider(): boolean {
    if (!this.questionnaire.titre.trim()) {
      this.erreur = 'Le titre est obligatoire';
      return false;
    }
    if (!this.questionnaire.theme.trim()) {
      this.erreur = 'Le thème est obligatoire';
      return false;
    }
    if (this.questionnaire.questions.length === 0) {
      this.erreur = 'Ajoutez au moins une question';
      return false;
    }
    return true;
  }

  annuler(): void {
    this.router.navigate(['/admin/questionnaires']);
  }
}