import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss'
})
export class ClientDashboard {

  nom = '';

  menus = [
    {
      titre: 'Mes Questionnaires',
      description: 'Consulter les questionnaires qui vous sont assignés',
      icone: '📋',
      couleur: '#4f46e5',
      route: '/client/liste'
    },
    {
      titre: 'Mes Résultats',
      description: 'Voir l\'historique de vos scores passés',
      icone: '📊',
      couleur: '#f59e0b',
      route: '/client/historique'
    },
    {
      titre: 'Mon Profil',
      description: 'Voir et modifier vos informations personnelles',
      icone: '👤',
      couleur: '#8b5cf6',
      route: '/client/profil'
    }
  ];

  constructor(private router: Router, private authService: AuthService) {
    this.nom = this.authService.getNom();
  }

  naviguer(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}