import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, StatistiquesResponse } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.scss'
})
export class AdminStats implements OnInit {

  stats: StatistiquesResponse | null = null;
  chargement = true;
  erreur = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.chargement = true;
    this.erreur = '';

    this.adminService.statistiques().subscribe({
      next: (data) => {
        this.stats = data;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement des statistiques';
        this.chargement = false;
      }
    });
  }
}