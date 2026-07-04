import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfilService, ProfilResponse } from '../../../core/services/profil';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.scss'
})
export class ProfilComponent implements OnInit {

  chargement = true;

  profil: ProfilResponse | null = null;
  nom = '';
  prenom = '';
  email = '';

  enregistrementInfos = false;
  erreurInfos = '';
  succesInfos = '';

  ancienMotDePasse = '';
  nouveauMotDePasse = '';
  confirmationMotDePasse = '';

  enregistrementMdp = false;
  erreurMdp = '';
  succesMdp = '';

  constructor(
    private profilService: ProfilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerProfil();
  }

  chargerProfil(): void {
    this.chargement = true;
    this.profilService.voirProfil().subscribe({
      next: (data) => {
        this.profil = data;
        this.nom = data.nom;
        this.prenom = data.prenom;
        this.email = data.email;
        this.chargement = false;
      },
      error: () => {
        this.erreurInfos = 'Erreur lors du chargement du profil';
        this.chargement = false;
      }
    });
  }

  enregistrerInfos(): void {
    this.erreurInfos = '';
    this.succesInfos = '';

    if (!this.nom.trim()) {
      this.erreurInfos = 'Le nom est obligatoire';
      return;
    }

    this.enregistrementInfos = true;

    this.profilService.modifierProfil({
      nom: this.nom,
      prenom: this.prenom
    }).subscribe({
      next: (data) => {
        this.profil = data;
        this.enregistrementInfos = false;
        this.succesInfos = 'Profil mis à jour avec succès !';
        localStorage.setItem('nom', data.nom);
        setTimeout(() => this.succesInfos = '', 3000);
      },
      error: (err) => {
        this.erreurInfos = err.error || 'Erreur lors de la mise à jour du profil';
        this.enregistrementInfos = false;
      }
    });
  }

  changerMotDePasse(): void {
    this.erreurMdp = '';
    this.succesMdp = '';

    if (!this.ancienMotDePasse || !this.nouveauMotDePasse || !this.confirmationMotDePasse) {
      this.erreurMdp = 'Tous les champs sont obligatoires';
      return;
    }
    if (this.nouveauMotDePasse.length < 6) {
      this.erreurMdp = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      return;
    }
    if (this.nouveauMotDePasse !== this.confirmationMotDePasse) {
      this.erreurMdp = 'La confirmation ne correspond pas au nouveau mot de passe';
      return;
    }

    this.enregistrementMdp = true;

    this.profilService.changerMotDePasse({
      ancienMotDePasse: this.ancienMotDePasse,
      nouveauMotDePasse: this.nouveauMotDePasse
    }).subscribe({
      next: () => {
        this.enregistrementMdp = false;
        this.succesMdp = 'Mot de passe modifié avec succès !';
        this.ancienMotDePasse = '';
        this.nouveauMotDePasse = '';
        this.confirmationMotDePasse = '';
        setTimeout(() => this.succesMdp = '', 3000);
      },
      error: (err) => {
        this.erreurMdp = err.error || 'Erreur lors du changement de mot de passe';
        this.enregistrementMdp = false;
      }
    });
  }

  retour(): void {
    this.router.navigate(['/client']);
  }
}