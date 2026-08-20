import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ConfigService } from '../../../core/services/config.service';

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
    private router: Router,
    public configService: ConfigService   // rendu public
  ) {
    this.nomAdmin = this.authService.getNom();
  }

  deconnexion(): void {
    this.authService.logout();
  }
}