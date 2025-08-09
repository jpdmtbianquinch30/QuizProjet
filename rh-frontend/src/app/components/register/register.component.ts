import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm = this.fb.group({
    nomComplet: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
    role: ['EMPLOYE'] // par défaut
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
  if (this.registerForm.valid) {
    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error('Erreur de l’API :', err);
        // Vérifie si err.error.message existe, sinon affiche toute la réponse
        const message = err?.error?.message || 'Une erreur est survenue';
        alert('Erreur : ' + message);
      }
    });
  }
}

}
