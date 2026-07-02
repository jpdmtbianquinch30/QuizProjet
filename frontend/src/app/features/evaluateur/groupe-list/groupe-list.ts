import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupeService, GroupeResponse } from '../../../core/services/groupe';

@Component({
  selector: 'app-groupe-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groupe-list.html',
  styleUrl: './groupe-list.scss'
})
export class GroupeListComponent implements OnInit {

  groupes: GroupeResponse[] = [];
  chargement = true;
  erreur = '';

  afficherModaleCreation = false;
  nouveauNom = '';
  nouvelleDescription = '';
  creationEnCours = false;
  erreurCreation = '';

  constructor(
    private groupeService: GroupeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerGroupes();
  }

  chargerGroupes(): void {
    this.chargement = true;
    this.groupeService.lister().subscribe({
      next: (data) => {
        this.groupes = data;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement des groupes';
        this.chargement = false;
      }
    });
  }

  ouvrirModaleCreation(): void {
    this.nouveauNom = '';
    this.nouvelleDescription = '';
    this.erreurCreation = '';
    this.afficherModaleCreation = true;
  }

  fermerModaleCreation(): void {
    this.afficherModaleCreation = false;
  }

  creerGroupe(): void {
    this.erreurCreation = '';

    if (!this.nouveauNom.trim()) {
      this.erreurCreation = 'Le nom du groupe est obligatoire';
      return;
    }

    this.creationEnCours = true;

    this.groupeService.creer({
      nom: this.nouveauNom,
      description: this.nouvelleDescription
    }).subscribe({
      next: (groupe) => {
        this.creationEnCours = false;
        this.afficherModaleCreation = false;
        this.router.navigate(['/evaluateur/groupes', groupe.id]);
      },
      error: (err) => {
        this.erreurCreation = err.error || 'Erreur lors de la création du groupe';
        this.creationEnCours = false;
      }
    });
  }

  ouvrirGroupe(id: number): void {
    this.router.navigate(['/evaluateur/groupes', id]);
  }

  supprimerGroupe(event: Event, id: number): void {
    event.stopPropagation();

    if (!confirm('Supprimer ce groupe ? Cette action est irréversible.')) return;

    this.groupeService.supprimer(id).subscribe({
      next: () => this.chargerGroupes(),
      error: () => this.erreur = 'Erreur lors de la suppression du groupe'
    });
  }

  retour(): void {
    this.router.navigate(['/evaluateur']);
  }
}