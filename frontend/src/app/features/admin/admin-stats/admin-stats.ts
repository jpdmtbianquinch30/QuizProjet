import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActiviteRecente {
  titre: string;
  description: string;
  temps: string;
  type: 'quiz' | 'inscription' | 'alerte';
}

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats.html',
  styleUrls: ['./admin-stats.scss']
})
export class AdminStats {
  
  totalEtudiants: number = 124;
  totalEvaluateurs: number = 18;
  totalQuiz: number = 45;
  tauxReussiteGlobal: number = 78;

  fluxActivites: ActiviteRecente[] = [
    {
      titre: 'Nouveau quiz publié',
      description: 'Mme Fatou Sow a créé le quiz "Sécurité des Bases de Données".',
      temps: 'Il y a 10 min',
      type: 'quiz'
    },
    {
      titre: 'Nouvel étudiant inscrit',
      description: 'Amadou Diallo a rejoint la plateforme.',
      temps: 'Il y a 1 heure',
      type: 'inscription'
    },
    {
      titre: 'Score d\'excellence',
      description: 'Meïssa Diop a obtenu 100% au quiz "Routage Angular".',
      temps: 'Il y a 2 heures',
      type: 'alerte'
    }
  ];
}