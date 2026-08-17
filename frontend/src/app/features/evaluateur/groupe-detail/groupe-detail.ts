import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupeService, GroupeResponse } from '../../../core/services/groupe';
import { QuestionnaireResponse } from '../../../core/models/quiz';
import { QuestionnaireService } from '../../../core/services/questionnaire';


@Component({
  selector: 'app-groupe-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groupe-detail.html',
  styleUrl: './groupe-detail.scss'
})
export class GroupeDetailComponent implements OnInit {

  id!: number;
  groupe: GroupeResponse | null = null;
  chargement = true;
  erreur = '';

  nom = '';
  description = '';
  enregistrementInfos = false;
  succesInfos = '';

  emailApprenant = '';
  ajoutEnCours = false;
  erreurAjout = '';

  questionnaires: QuestionnaireResponse[] = [];
  questionnaireSelectionneId: number | null = null;
  assignationEnCours = false;
  succesAssignation = '';
<<<<<<< HEAD
=======
  questionnaireGlisseId: number | null = null;
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6

  constructor(
    private groupeService: GroupeService,
    private questionnaireService: QuestionnaireService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.chargerGroupe();
    this.chargerQuestionnaires();
  }

  chargerGroupe(): void {
    this.chargement = true;
    this.groupeService.afficher(this.id).subscribe({
      next: (data) => {
        this.groupe = data;
        this.nom = data.nom;
        this.description = data.description;
        this.questionnaireSelectionneId = data.questionnaireAssigneId;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement du groupe';
        this.chargement = false;
      }
    });
  }

  chargerQuestionnaires(): void {
    this.questionnaireService.listerTous().subscribe({
      next: (data) => this.questionnaires = data,
      error: () => {}
    });
  }

  enregistrerInfos(): void {
    if (!this.nom.trim()) {
      this.erreur = 'Le nom est obligatoire';
      return;
    }

    this.enregistrementInfos = true;
    this.erreur = '';

    this.groupeService.modifier(this.id, {
      nom: this.nom,
      description: this.description
    }).subscribe({
      next: (data) => {
        this.groupe = data;
        this.enregistrementInfos = false;
        this.succesInfos = 'Groupe mis à jour !';
        setTimeout(() => this.succesInfos = '', 3000);
      },
      error: () => {
        this.erreur = 'Erreur lors de la mise à jour du groupe';
        this.enregistrementInfos = false;
      }
    });
  }

  ajouterApprenant(): void {
    this.erreurAjout = '';

    if (!this.emailApprenant.trim()) {
      this.erreurAjout = 'Veuillez saisir un email';
      return;
    }

    this.ajoutEnCours = true;

    this.groupeService.ajouterApprenants(this.id, [this.emailApprenant.trim()]).subscribe({
      next: (data) => {
        this.groupe = data;
        this.emailApprenant = '';
        this.ajoutEnCours = false;
      },
      error: (err) => {
        this.erreurAjout = err.error || "Erreur lors de l'ajout de l'apprenant";
        this.ajoutEnCours = false;
      }
    });
  }

  retirerApprenant(apprenantId: number): void {
    if (!confirm('Retirer cet apprenant du groupe ?')) return;

    this.groupeService.retirerApprenant(this.id, apprenantId).subscribe({
      next: (data) => this.groupe = data,
      error: () => this.erreur = "Erreur lors du retrait de l'apprenant"
    });
  }

  assignerQuestionnaire(): void {
    if (!this.questionnaireSelectionneId) return;

    this.assignationEnCours = true;

    this.groupeService.assignerQuestionnaire(this.id, this.questionnaireSelectionneId).subscribe({
      next: (data) => {
        this.groupe = data;
        this.assignationEnCours = false;
        this.succesAssignation = 'Questionnaire assigné !';
        setTimeout(() => this.succesAssignation = '', 3000);
      },
      error: () => {
        this.erreur = "Erreur lors de l'assignation du questionnaire";
        this.assignationEnCours = false;
      }
    });
  }

<<<<<<< HEAD
  retour(): void {
    this.router.navigate(['/evaluateur/groupes']);
  }
}
=======
  debutGlisser(questionnaireId: number, event: DragEvent): void {
    this.questionnaireGlisseId = questionnaireId;
    event.dataTransfer?.setData('questionnaireId', questionnaireId.toString());
  }

  deposerQuestionnaire(event: DragEvent): void {
    event.preventDefault();
    const id = Number(event.dataTransfer?.getData('questionnaireId')) || this.questionnaireGlisseId;
    if (!id) return;
    this.questionnaireSelectionneId = id;
    this.assignerQuestionnaire();
    this.questionnaireGlisseId = null;
  }

  publierEtAssigner(): void {
    if (!this.questionnaireSelectionneId) return;
    this.assignationEnCours = true;
    this.questionnaireService.changerStatut(this.questionnaireSelectionneId, 'PUBLIE').subscribe({
      next: () => this.assignerQuestionnaire(),
      error: () => {
        this.erreur = 'Impossible de publier ce questionnaire';
        this.assignationEnCours = false;
      }
    });
  }

  retour(): void {
    this.router.navigate(['/evaluateur/groupes']);
  }
}
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6
