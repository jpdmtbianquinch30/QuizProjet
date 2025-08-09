import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Liste des employés</h1>
    <p>Cette page est protégée et nécessite une authentification.</p>
  `
})
export class EmployeComponent {}
