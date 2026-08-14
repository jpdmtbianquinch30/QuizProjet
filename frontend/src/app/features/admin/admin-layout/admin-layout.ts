import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayoutComponent {

  nomAdmin = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.nomAdmin = this.authService.getNom();
  }

  deconnexion(): void {
    this.authService.logout();
  }
}