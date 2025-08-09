// src/app/components/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Bienvenue sur le tableau de bord</h1>`,
})
export class DashboardComponent {}
