import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ApprenantStatResponse } from '../../../core/services/admin';

@Component({
  selector: 'app-manage-apprenants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-apprenants.html',
  styleUrl: './manage-apprenants.scss'
})
export class ManageEtudiantsComponent implements OnInit {

  apprenants: ApprenantStatResponse[] = [];
  chargement = true;
  erreur = '';
  idEnCours: number | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.chargerApprenants();
  }

  chargerApprenants(): void {
    this.chargement = true;
    this.erreur = '';

    this.adminService.apprenants().subscribe({
      next: (data) => {
        this.apprenants = data;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement des apprenants';
        this.chargement = false;
      }
    });
  }

  changerStatut(apprenant: ApprenantStatResponse): void {
    this.idEnCours = apprenant.id;

    this.adminService.changerStatut(apprenant.id).subscribe({
      next: (res) => {
        apprenant.actif = res.actif;
        this.idEnCours = null;
      },
      error: () => {
        this.erreur = 'Erreur lors du changement de statut';
        this.idEnCours = null;
      }
    });
  }
}