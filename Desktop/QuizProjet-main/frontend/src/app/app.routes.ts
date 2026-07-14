import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { evaluateurGuard } from './core/guards/evaluateur-guard';

export const routes: Routes = [

  // =========================
  // AUTH
  // =========================
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.RegisterComponent)
  },

  // =========================
  // ADMIN DASHBOARD
  // =========================
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboardComponent)
  },

  // =========================
  // ADMIN UTILISATEURS
  // =========================
  {
    path: 'admin/utilisateurs',
    loadComponent: () =>
      import('./features/utilisateurs/user-list/user-list')
        .then(m => m.UserListComponent)
  },

  {
    path: 'admin/utilisateurs/new',
    loadComponent: () =>
      import('./features/utilisateurs/user-form/user-form')
        .then(m => m.UserFormComponent)
  },

  // =========================
  // ADMIN QUESTIONNAIRES
  // =========================
  {
    path: 'admin/questionnaires',
    loadComponent: () =>
      import('./features/admin/questionnaires/questionnaire-admin-list/questionnaire-admin-list')
        .then(m => m.QuestionnaireAdminListComponent)
  },

  {
    path: 'admin/questionnaires/archives',
    loadComponent: () =>
      import('./features/admin/questionnaires/questionnaire-archives/questionnaire-archives')
        .then(m => m.QuestionnaireArchivesComponent)
  },

  // =========================
  // CLIENT / QUIZ
  // =========================
  {
    path: 'quiz',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/client/client-dashboard/client-dashboard')
            .then(m => m.ClientDashboardComponent)
      }
    ]
  },

  // =========================
  // EVALUATEUR
  // =========================
  {
    path: 'evaluateur',
    canActivate: [evaluateurGuard],
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./features/evaluateur/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },

      {
        path: 'questionnaires',
        loadComponent: () =>
          import('./features/questionnaire/questionnaire-list/questionnaire-list')
            .then(m => m.QuestionnaireListComponent)
      },

      {
        path: 'questionnaires/nouveau',
        loadComponent: () =>
          import('./features/questionnaire/questionnaire-form/questionnaire-form')
            .then(m => m.QuestionnaireFormComponent)
      },

      {
        path: 'questionnaires/modifier/:id',
        loadComponent: () =>
          import('./features/questionnaire/questionnaire-form/questionnaire-form')
            .then(m => m.QuestionnaireFormComponent)
      },

      {
        path: 'profil',
        loadComponent: () =>
          import('./features/evaluateur/profil/profil')
            .then(m => m.ProfilComponent)
      },

      {
        path: 'classement',
        loadComponent: () =>
          import('./features/evaluateur/classement/classement')
            .then(m => m.ClassementComponent)
      },

      {
        path: 'groupes',
        loadComponent: () =>
          import('./features/evaluateur/groupe-list/groupe-list')
            .then(m => m.GroupeListComponent)
      },

      {
        path: 'groupes/:id',
        loadComponent: () =>
          import('./features/evaluateur/groupe-detail/groupe-detail')
            .then(m => m.GroupeDetailComponent)
      }
    ]
  },

  // =========================
  // FALLBACK
  // =========================
  { path: '**', redirectTo: 'login' }
];