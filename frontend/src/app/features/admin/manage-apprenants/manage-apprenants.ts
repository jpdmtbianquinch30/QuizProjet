import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Etudiant {
  nom: string;
  email: string;
  scoreMoyen: number;
  quizCompletes: number;
  totalQuiz: number;
  statut: 'Actif' | 'Bloqué';
}

@Component({
  selector: 'app-manage-etudiants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-apprenants.html',
  styleUrls: ['./manage-apprenants.scss']
})
export class ManageEtudiantsComponent {
  
  listeEtudiants: Etudiant[] = [
    { nom: 'Meïssa Diop', email: 'meissa.diop@isi.sn', scoreMoyen: 85, quizCompletes: 12, totalQuiz: 15, statut: 'Actif' },
    { nom: 'Amadou Diallo', email: 'amadou.diallo@isi.sn', scoreMoyen: 62, quizCompletes: 5, totalQuiz: 15, statut: 'Bloqué' },
    { nom: 'Fatou Sow', email: 'fatou.sow@isi.sn', scoreMoyen: 91, quizCompletes: 14, totalQuiz: 15, statut: 'Actif' }
  ];

  changerStatut(etudiant: Etudiant): void {
    etudiant.statut = etudiant.statut === 'Actif' ? 'Bloqué' : 'Actif';
  }
}