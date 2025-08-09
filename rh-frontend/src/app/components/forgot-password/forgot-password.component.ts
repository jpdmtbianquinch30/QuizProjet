// components/forgot-password/forgot-password.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Mot de passe oublié</h2>
    <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
      <input type="email" formControlName="email" placeholder="Votre email" />
      <button type="submit" [disabled]="forgotForm.invalid">Envoyer</button>
    </form>
    <p *ngIf="message" style="color:green">{{message}}</p>
    <p *ngIf="error" style="color:red">{{error}}</p>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  forgotForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  message = '';
  error = '';

  onSubmit() {
    if (!this.forgotForm.valid) return;
    this.auth.forgotPassword(this.forgotForm.value.email!).subscribe({
      next: res => {
        this.message = res?.message || 'Email envoyé si l’adresse existe.';
        this.error = '';
        setTimeout(()=> this.router.navigate(['/login']), 2500);
      },
      error: err => {
        console.error(err);
        this.error = err?.error?.message || 'Impossible d\'envoyer l\'email.';
      }
    });
  }
}
