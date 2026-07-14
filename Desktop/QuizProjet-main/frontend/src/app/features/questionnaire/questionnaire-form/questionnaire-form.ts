import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionnaireService, QuestionnaireRequest } from '../../../core/services/questionnaire';
import { IaService } from '../../../core/services/ia';

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

  // ===== Génération IA =====
  afficherModaleIA = false;
  chargementIA = false;
  erreurIA = '';
  iaTheme = '';
  iaNombreQuestions = 5;
  iaNiveau = 'MOYEN';

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
    private iaService: IaService,
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
        setTimeout(() => this.router.navigate(['/evaluateur/questionnaires']), 1500);
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

  // ===== Génération IA =====

  ouvrirModaleIA(): void {
    this.erreurIA = '';
    if (!this.iaTheme) {
      this.iaTheme = this.questionnaire.theme;
    }
    this.afficherModaleIA = true;
  }

  fermerModaleIA(): void {
    this.afficherModaleIA = false;
  }

  genererAvecIA(): void {
    this.erreurIA = '';

    if (!this.iaTheme.trim()) {
      this.erreurIA = 'Le thème est obligatoire';
      return;
    }
    if (!this.iaNombreQuestions || this.iaNombreQuestions < 1) {
      this.erreurIA = 'Le nombre de questions doit être au moins 1';
      return;
    }

    this.chargementIA = true;

    this.iaService.genererQuestions({
      theme: this.iaTheme,
      nombreQuestions: this.iaNombreQuestions,
      niveau: this.iaNiveau
    }).subscribe({
      next: (res) => {
        const questionsVides = this.questionnaire.questions.length === 1
          && !this.questionnaire.questions[0].contenu.trim();

        if (questionsVides) {
          this.questionnaire.questions = [];
        }

        const decalage = this.questionnaire.questions.length;
        const nouvelles = res.questions.map((q, i) => ({
          ...q,
          ordre: decalage + i + 1
        }));

        this.questionnaire.questions.push(...nouvelles);

        if (!this.questionnaire.theme.trim()) {
          this.questionnaire.theme = this.iaTheme;
        }

        this.chargementIA = false;
        this.afficherModaleIA = false;
        this.succes = `${res.questions.length} question(s) générée(s) par l'IA !`;
        setTimeout(() => this.succes = '', 3000);
      },
      error: (err) => {
        this.erreurIA = err.error || 'Erreur lors de la génération IA';
        this.chargementIA = false;
      }
    });
  }
}