import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  private fb = inject(FormBuilder); // ✅ Injection simplifiée
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required]
  });
  

 onSubmit(): void {
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const role = this.authService.getRole();
        if (role === 'ADMIN') this.router.navigate(['/admin-dashboard']);
        else if (role === 'MANAGER') this.router.navigate(['/manager-dashboard']);
        else this.router.navigate(['/employe-dashboard']);
      },
      error: err => console.error('Erreur de connexion', err)
    });
  }
}

}
