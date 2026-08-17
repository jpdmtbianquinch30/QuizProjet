import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, EvaluateurStatResponse } from '../../../core/services/admin';

@Component({
  selector: 'app-manage-evaluateurs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-evaluateurs.html',
  styleUrl: './manage-evaluateurs.scss'
})
export class ManageEvaluateursComponent implements OnInit {

  evaluateurs: EvaluateurStatResponse[] = [];
  chargement = true;
  erreur = '';
  idEnCours: number | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.chargerEvaluateurs();
  }

  chargerEvaluateurs(): void {
    this.chargement = true;
    this.erreur = '';

    this.adminService.evaluateurs().subscribe({
      next: (data) => {
        this.evaluateurs = data;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement des évaluateurs';
        this.chargement = false;
      }
    });
  }

  changerStatut(evaluateur: EvaluateurStatResponse): void {
    this.idEnCours = evaluateur.id;

    this.adminService.changerStatut(evaluateur.id).subscribe({
      next: (res) => {
        evaluateur.actif = res.actif;
        this.idEnCours = null;
      },
      error: () => {
        this.erreur = 'Erreur lors du changement de statut';
        this.idEnCours = null;
      }
    });
  }
}