import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent {
stats = {
  utilisateurs: 0,
  evaluateurs: 0,
  questionnaires: 0,
  archives: 0
};

loading = false;
goUsers() {
  this.router.navigate(['/admin/utilisateurs']);
}


goQuestionnaires() {
  this.router.navigate(['/admin/questionnaires']);
}


goArchives() {
  this.router.navigate(['/admin/questionnaires/archives']);
}

 menus = [

{
titre:'Gestion des utilisateurs',
description:'Créer, modifier ou supprimer des comptes.',
icone:'👥',
couleur:'#4f46e5',
route:'/admin/utilisateurs'
},

{
titre:'Questionnaires',
description:'Archiver, restaurer ou supprimer les questionnaires.',
icone:'📝',
couleur:'#10b981',
route:'/admin/questionnaires'
},

{
titre:'Statistiques',
description:'Consulter les statistiques de la plateforme.',
icone:'📊',
couleur:'#f59e0b',
route:''
},

{
titre:'Paramètres',
description:'Configuration générale.',
icone:'⚙',
couleur:'#8b5cf6',
route:''
}

];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  naviguer(route: string) {
    if(route){
      this.router.navigate([route]);
    }
  }

  logout() {
    this.authService.logout();
  }

}