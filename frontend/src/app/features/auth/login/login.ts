import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  erreur = '';
  chargement = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.chargement = true;
    this.erreur = '';
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          if (res.role === 'ADMIN') {
            this.router.navigate(['/admin/questionnaires']);
          } else {
            this.erreur = 'Accès réservé aux administrateurs';
            this.chargement = false;
          }
        },
        error: () => {
          this.erreur = 'Email ou mot de passe incorrect';
          this.chargement = false;
        }
      });
  }
}