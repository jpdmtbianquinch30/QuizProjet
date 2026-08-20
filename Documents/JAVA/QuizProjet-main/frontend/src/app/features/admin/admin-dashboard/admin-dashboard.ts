import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ConfigService } from '../../../core/services/config.service';
import { PlatformConfig } from '../../../core/services/config.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  currentTab: 'dashboard' | 'settings' = 'dashboard';
  configForm: FormGroup;
  saving = false;
  saveSuccess = false;
  saveError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private configService: ConfigService
  ) {
    this.configForm = this.fb.group({
      platformName: ['', Validators.required],
      primaryColor: ['', Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/)],
      secondaryColor: ['', Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/)],
      logoUrl: [''],
      maintenanceMode: [false]
    });
  }

  ngOnInit(): void {
    // Charger la config actuelle dans le formulaire
    this.configService.config$.subscribe(config => {
      if (config) {
        this.configForm.patchValue(config);
      }
    });
  }

  switchTab(tab: 'dashboard' | 'settings'): void {
    this.currentTab = tab;
    if (tab === 'settings') {
      // Rafraîchir avec la config actuelle
      const current = this.configService.getCurrentConfig();
      if (current) {
        this.configForm.patchValue(current);
      }
    }
  }

  // Live preview : applique la couleur au survol ou à la saisie
  onColorChange(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    // Mise à jour du formulaire (pour la validation)
    this.configForm.get(field)?.setValue(color);
    // Application immédiate sur le DOM
    const cssVar = field === 'primaryColor' ? '--primary-color' : '--secondary-color';
    document.documentElement.style.setProperty(cssVar, color);
  }

  saveConfig(): void {
    if (this.configForm.invalid) return;

    this.saving = true;
    this.saveSuccess = false;
    this.saveError = false;

    const config: PlatformConfig = this.configForm.value;

    this.configService.updateConfig(config).subscribe({
      next: (updatedConfig) => {
        this.saving = false;
        this.saveSuccess = true;
        // Mettre à jour le cache local et appliquer le thème
        this.configService.applyTheme(updatedConfig);
        // Recharger le subject
        this.configService['configSubject'].next(updatedConfig);
        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: () => {
        this.saving = false;
        this.saveError = true;
        setTimeout(() => this.saveError = false, 5000);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}