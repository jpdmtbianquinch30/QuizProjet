import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { evaluateurGuard } from './core/guards/evaluateur-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register')
      .then(m => m.RegisterComponent)
  },
  {
  path: 'admin-dashboard',
  loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard')
    .then(m => m.AdminDashboardComponent)
},
{
  path: 'client',
  canActivate: [authGuard],
  children: [
    {
      path: '',
      loadComponent: () => import('./features/client/client-dashboard/client-dashboard')
        .then(m => m.ClientDashboard)
    },
    {
      path: 'liste',
      loadComponent: () => import('./features/client/quiz-list/quiz-list')
        .then(m => m.QuizList)
    },
    {
      path: 'jouer/:id',
      loadComponent: () => import('./features/client/quiz-play/quiz-play')
        .then(m => m.QuizPlay)
    },
    {
      path: 'resultat',
      loadComponent: () => import('./features/client/quiz-result/quiz-result')
        .then(m => m.QuizResult)
    },
    {
      path: 'historique',
      loadComponent: () => import('./features/client/quiz-historique/quiz-historique')
        .then(m => m.QuizHistorique)
    },
    {
      path: 'profil',
      loadComponent: () => import('./features/client/profil/profil')
        .then(m => m.ProfilComponent)
    }
  ]
},
  {
  path: 'evaluateur',
  canActivate: [evaluateurGuard],
  children: [
    {
      path: '',
      loadComponent: () => import('./features/evaluateur/dashboard/dashboard')
        .then(m => m.DashboardComponent)
    },
    {
      path: 'questionnaires',
      loadComponent: () => import('./features/questionnaire/questionnaire-list/questionnaire-list')
        .then(m => m.QuestionnaireListComponent)
    },
    {
      path: 'questionnaires/nouveau',
      loadComponent: () => import('./features/questionnaire/questionnaire-form/questionnaire-form')
        .then(m => m.QuestionnaireFormComponent)
    },
    {
       path: 'profil',
     loadComponent: () => import('./features/evaluateur/profil/profil')
        .then(m => m.ProfilComponent)
},
    {
      path: 'questionnaires/modifier/:id',
      loadComponent: () => import('./features/questionnaire/questionnaire-form/questionnaire-form')
        .then(m => m.QuestionnaireFormComponent)
    },
    {
  path: 'profil',
  loadComponent: () => import('./features/evaluateur/profil/profil')
    .then(m => m.ProfilComponent)
},
{
  path: 'classement',
  loadComponent: () => import('./features/evaluateur/classement/classement')
    .then(m => m.ClassementComponent)
},
{
  path: 'classement',
  loadComponent: () => import('./features/evaluateur/classement/classement')
    .then(m => m.ClassementComponent)
},
{
  path: 'groupes',
  loadComponent: () => import('./features/evaluateur/groupe-list/groupe-list')
    .then(m => m.GroupeListComponent)
},
{
  path: 'groupes/:id',
  loadComponent: () => import('./features/evaluateur/groupe-detail/groupe-detail')
    .then(m => m.GroupeDetailComponent)
}
    
  ]
},
  { path: '**', redirectTo: 'login' }
];