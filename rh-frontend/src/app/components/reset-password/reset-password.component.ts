// components/reset-password/reset-password.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Réinitialiser le mot de passe</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="password" formControlName="newPassword" placeholder="Nouveau mot de passe" />
      <input type="password" formControlName="confirmPassword" placeholder="Confirmer" />
      <button type="submit" [disabled]="form.invalid">Réinitialiser</button>
    </form>
    <p *ngIf="message" style="color:green">{{message}}</p>
    <p *ngIf="error" style="color:red">{{error}}</p>
  `
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);

  token = this.route.snapshot.queryParamMap.get('token') || '';
  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });
  message = '';
  error = '';

  onSubmit() {
    if (!this.form.valid) return;
    const { newPassword, confirmPassword } = this.form.value;
    if (newPassword !== confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }
    this.auth.resetPassword(this.token, newPassword!).subscribe({
      next: res => {
        this.message = res?.message || 'Mot de passe modifié';
        setTimeout(()=> this.router.navigate(['/login']), 2000);
      },
      error: err => {
        console.error(err);
        this.error = err?.error?.message || 'Impossible de réinitialiser le mot de passe';
      }
    });
  }
}
