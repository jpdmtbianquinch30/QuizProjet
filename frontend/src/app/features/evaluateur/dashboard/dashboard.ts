import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {

  nom = '';

  menus = [
    {
      titre: 'Gérer les Questionnaires',
      description: 'Créer, afficher, modifier et supprimer des questionnaires',
      icone: '📝',
      couleur: '#4f46e5',
      route: '/evaluateur/questionnaires'
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