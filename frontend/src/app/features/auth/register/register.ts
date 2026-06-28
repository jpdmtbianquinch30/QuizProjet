import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  erreur = '';
  succes = '';
  chargement = false;

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.erreur = '';
    this.succes = '';

    if (this.password !== this.confirmPassword) {
      this.erreur = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 6) {
      this.erreur = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.chargement = true;

    this.authService.register({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.succes = 'Compte créé ! Redirection vers la connexion...';
          this.chargement = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.erreur = err.error || 'Erreur lors de la création du compte';
          this.chargement = false;
        }
      });
  }

  allerLogin(): void {
    this.router.navigate(['/login']);
  }
}