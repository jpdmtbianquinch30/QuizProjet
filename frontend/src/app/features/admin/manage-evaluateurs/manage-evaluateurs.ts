import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Evaluateur {
  nom: string;
  email: string;
  specialite: string;
  quizCrees: number;
  statut: 'Actif' | 'Bloqué';
}

@Component({
  selector: 'app-manage-evaluateurs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-evaluateurs.html',
  styleUrls: ['./manage-evaluateurs.scss']
})
export class ManageEvaluateursComponent {

  listeEvaluateurs: Evaluateur[] = [
    {
      nom: 'Dr. Amadou Diallo',
      email: 'amadou.diallo@isi.sn',
      specialite: 'Génie Logiciel',
      quizCrees: 8,
      statut: 'Actif'
    },
    {
      nom: 'Mme. Fatou Sow',
      email: 'fatou.sow@isi.sn',
      specialite: 'Bases de Données',
      quizCrees: 5,
      statut: 'Actif'
    },
    {
      nom: 'M. Cheikh Anta Diop',
      email: 'cheikh.diop@isi.sn',
      specialite: 'Cloud Computing',
      quizCrees: 12,
      statut: 'Bloqué'
    }
  ];

  changerStatut(evaluator: Evaluateur): void {
    evaluator.statut = evaluator.statut === 'Actif' ? 'Bloqué' : 'Actif';
  }
}