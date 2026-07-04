import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../core/services/quiz';
import { QuestionnaireResponse } from '../../../core/models/quiz';



@Component({
  selector: 'app-quiz-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-play.html',
  styleUrl: './quiz-play.scss',
})
export class QuizPlay implements OnInit, OnDestroy {
  questionnaire: QuestionnaireResponse | null = null;
  chargement = true;
  erreur = '';

  indexActuel = 0;
  reponses: (number | null)[] = [];

  // Suivi du feedback vert/rouge par question, indexé comme `reponses`
  verifications: ({ correcte: boolean; bonneReponseIndex: number } | null)[] = [];

  tempsRestant = 0;
  private timerId: any;
  soumissionEnCours = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quizService.getQuestionnairePourJeu(id).subscribe({
      next: (data) => {
        this.questionnaire = data;
        this.questionnaire.questions.sort((a, b) => a.ordre - b.ordre);
        this.reponses = new Array(data.questions.length).fill(null);
        this.verifications = new Array(data.questions.length).fill(null);
        this.tempsRestant = data.dureeSecondes;
        this.chargement = false;
        this.demarrerTimer();
      },
      error: (err) => {
        if (err.status === 409) {
          this.router.navigate(['/quiz/historique']);
          return;
        }
        this.erreur =
          err.status === 403
            ? "Vous n'avez pas accès à ce questionnaire."
            : 'Erreur lors du chargement du quiz.';
        this.chargement = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.arreterTimer();
  }

  private demarrerTimer(): void {
    this.timerId = setInterval(() => {
      this.tempsRestant--;
      if (this.tempsRestant <= 0) {
        this.arreterTimer();
        this.soumettre();
      }
    }, 1000);
  }

  private arreterTimer(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  get minutesSecondes(): string {
    const m = Math.floor(this.tempsRestant / 60);
    const s = this.tempsRestant % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  get questionCourante() {
    return this.questionnaire?.questions[this.indexActuel] ?? null;
  }

  // Une fois répondu, on verrouille : on ne peut plus changer d'avis
  dejaRepondu(): boolean {
    return this.verifications[this.indexActuel] !== null;
  }

  choisir(index: number): void {
    const question = this.questionCourante;
    if (this.dejaRepondu() || !question || question.id === undefined) return;

    this.reponses[this.indexActuel] = index;

    this.quizService.verifierReponse(question.id, index).subscribe({
      next: (res) => {
        this.verifications[this.indexActuel] = res;
      },
      error: () => {
        this.verifications[this.indexActuel] = { correcte: false, bonneReponseIndex: -1 };
      },
    });
  }

  classeChoix(index: number): string {
    const verif = this.verifications[this.indexActuel];
    if (!verif) return '';

    if (index === this.reponses[this.indexActuel]) {
      return verif.correcte ? 'correct' : 'incorrect';
    }
    if (index === verif.bonneReponseIndex && !verif.correcte) {
      return 'bonne-reponse'; // on montre aussi la bonne réponse si l'apprenant s'est trompé
    }
    return '';
  }

  suivant(): void {
    if (this.questionnaire && this.indexActuel < this.questionnaire.questions.length - 1) {
      this.indexActuel++;
    }
  }

  precedent(): void {
    if (this.indexActuel > 0) this.indexActuel--;
  }

  get estDerniereQuestion(): boolean {
    return (
      !!this.questionnaire &&
      this.indexActuel === this.questionnaire.questions.length - 1
    );
  }

  soumettre(): void {
    if (!this.questionnaire || this.soumissionEnCours) return;
    this.soumissionEnCours = true;
    this.arreterTimer();

    this.quizService
      .soumettre({ questionnaireId: this.questionnaire.id, reponses: this.reponses })
      .subscribe({
        next: (score) => {
          this.router.navigate(['/client/resultat'], { state: { score } });
        },
        error: (err) => {
          if (err.status === 409) {
            this.router.navigate(['/client/historique']);
            return;
          }
          this.erreur = 'Erreur lors de la soumission de vos réponses.';
          this.soumissionEnCours = false;
        },
      });
  }
}