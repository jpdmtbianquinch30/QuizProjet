# API Easy Planning

## Description
API Easy Planning est une API REST développée avec Laravel pour la gestion des plannings et des employés. Elle permet de gérer les emplois du temps et les affectations des employés de manière flexible et efficace.

## Architecture du Projet

```
api-easy-planning/
├── app/
│   ├── Http/
│   │   ├── Controllers/   # Contrôleurs de l'application
│   │   ├── Requests/      # Classes de validation des requêtes
│   │   └── Resources/     # Ressources API
│   └── Models/            # Modèles Eloquent
│       ├── Employee.php
│       └── Planning.php
├── database/
│   ├── migrations/        # Migrations de base de données
├── routes/
│   └── api.php           # Routes de l'API
└── tests/
    └── Feature/          # Tests fonctionnels
```

## Structure de la Base de Données

### Table `employees`
- `id` : Identifiant unique
- `name` : Nom de l'employé
- `email` : Email de l'employé
- `timestamps` : Dates de création et modification

### Table `plannings`
- `id` : Identifiant unique
- `name` : Nom du planning
- `work_date` : Date de travail
- `start_time` : Heure de début
- `end_time` : Heure de fin
- `notes` : Notes (optionnel)
- `timestamps` : Dates de création et modification

### Table `employee_planning` (Table pivot) pour l'affectation des employés aux plannings(many-to-many)
- `employee_id` : Référence vers un employé
- `planning_id` : Référence vers un planning
- `timestamps` : Dates de création et modification

## Fonctionnalités Principales

1. Gestion des Employés
   - Création d'employés
   - Consultation des employés
   - Suppression d'employés

2. Gestion des Plannings
   - Création de plannings
   - Consultation des plannings
   - Modification des plannings
   - Suppression de plannings

3. Gestion des Affectations
   - Attribution d'employés aux plannings
   - Consultation des affectations
   - Modification des affectations
   - Suppression d'affectations

4. Authentification et Gestion des Utilisateurs
   - Inscription (register)
   - Connexion (login)
   - Déconnexion (logout)
   - Consultation du profil (me)
   - Réinitialisation de mot de passe

## Routes API

### Routes d'Authentification
```
POST /api/auth/register     # Inscription d'un nouvel utilisateur
POST /api/auth/login       # Connexion
POST /api/auth/logout      # Déconnexion (nécessite authentification)
GET  /api/auth/me         # Obtenir les informations de l'utilisateur connecté
```

### Routes de Réinitialisation de Mot de Passe
```
POST /api/password/forgot   # Demander un lien de réinitialisation
POST /api/password/reset    # Réinitialiser le mot de passe avec le token
```

Format des requêtes pour la réinitialisation de mot de passe :

1. Demande de réinitialisation (`/api/password/forgot`) :
```json
{
    "email": "utilisateur@example.com"
}
```

2. Réinitialisation (`/api/password/reset`) :
```json
{
    "email": "utilisateur@example.com",
    "password": "nouveau_mot_de_passe",
    "password_confirmation": "nouveau_mot_de_passe",
    "token": "token_reçu_par_email"
}
```

## Installation et Configuration

1. Cloner le projet
```bash
git clone [https://github.com/team-ubuntu9/api-easy-planning-groupe2.git]
cd api-easy-planning-groupe2
```

2. Installer les dépendances
```bash
composer install
```

3. Configurer l'environnement
```bash
cp .env.example .env
php artisan key:generate
```

4. Configurer la base de données dans `.env`
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=easy_planning
DB_USERNAME=root
DB_PASSWORD=
```

5. Exécuter les migrations
```bash
php artisan migrate
```

## Tests

L'application inclut une suite complète de tests automatisés pour garantir son bon fonctionnement. Pour exécuter les tests :

```bash
php artisan test --env=testing
```

### Tests Fonctionnels (Feature Tests)

Les tests sont organisés dans `tests/Feature/TestControllerTest.php` et couvrent les aspects suivants :

#### 1. Gestion des Employés
- `test_cree_un_employe` : Création d'un nouvel employé
- `test_liste_tous_les_employees` : Récupération de la liste des employés
- `test_creation_employee_avec_donnees_invalides` : Validation des données employé
- `test_creation_employee_avec_email_duplique` : Vérification des emails uniques

#### 2. Gestion des Plannings
- `test_creates_un_planning` : Création d'un nouveau planning
- `test_modifie_un_planning` : Modification d'un planning existant
- `test_supprimer_un_planning` : Suppression d'un planning
- `test_liste_tous_les_plannings` : Récupération de la liste des plannings
- `test_affiche_un_planning_avec_employes` : Affichage détaillé avec employés

#### 3. Gestion des Affectations
- `test_assigne_un_employe_au_planning` : Affectation d'un employé
- `test_supprime_un_employee_dun_planning` : Retrait d'un employé
- `test_assignation_employe_inexistant_au_planning` : Gestion des erreurs
- `test_assignation_a_planning_inexistant` : Gestion des plannings inexistants

#### 4. Gestion des Conflits
- `test_conflit_detecte_meme_journee` : Détection des chevauchements
- `test_conflit_detecte_shift_traverse_minuit` : Gestion des shifts de nuit
- `test_pas_de_conflit_shifts_consecutifs` : Validation des shifts consécutifs
- `test_conflit_shifts_differents_jours_normaux` : Gestion multi-jours

#### 5. Fonctionnalité de Duplication
- `test_duplication_de_planning_sur_plusieurs_dates` : Duplication sur plusieurs dates
- `test_duplication_skip_si_conflit` : Gestion des conflits lors de la duplication
- `test_duplication_avec_dates_invalides` : Validation des dates
- `test_duplication_sans_nouvelles_dates` : Gestion des erreurs de duplication

### Couverture des Tests

Les tests couvrent :
- Création d'employés
- Création de plannings
- Création d'affectations
- Consultation des plannings
- Validation des données
- Gestion des erreurs
- Conflits d'horaires
- Cache
- Relations entre modèles
- Contraintes d'unicité
- Shifts de nuit
- Duplication de planning

Chaque test utilise une base de données en mémoire (via `RefreshDatabase`) pour garantir l'isolation des tests.

## Cache

L'application utilise le système de cache de Laravel pour optimiser les performances :

- Les listes d'employés et de plannings sont mises en cache
- Le cache est invalidé automatiquement lors des modifications

## Validation des Données

La validation des données est gérée par des Form Requests personnalisés :

- `StoreEmployeeRequest` : Validation création employé
- `StorePlanningRequest` : Validation création planning
- `UpdatePlanningRequest` : Validation modification planning
- `AssignEmployeeRequest` : Validation affectation employé
- `RemoveEmployeesRequest` : Validation suppression affectation

## Routes API

Toutes les routes de l'API sont préfixées par `/api` dans bootstrap/app.php

### Employés
- GET `/api/employees` : Liste des employés
- POST `/api/employees` : Création d'un employé

### Plannings
- GET `/api/plannings` : Liste des plannings
- POST `/api/plannings` : Création d'un planning
- GET `/api/plannings/{id}` : Détails d'un planning
- PUT `/api/plannings/{id}` : Modification d'un planning
- DELETE `/api/plannings/{id}` : Suppression d'un planning

### Affectations
- POST `/api/plannings/{id}/assigne` : Affecter des employés
- DELETE `/api/{planningId}/employee` : Retirer des employés

### Duplication de Planning
- POST `/api/plannings/{id}/duplicate` : Dupliquer un planning sur plusieurs dates

#### Format de la requête de duplication

```json
{
    "new_date": ["2025-09-26", "2025-09-27"],
    "include_employees": true,
    "rename_with_date": true
}
```

- `new_date` : Tableau des dates pour lesquelles le planning doit être dupliqué
- `include_employees` : Si true, les employés du planning source seront également affectés aux nouveaux plannings
- `rename_with_date` : Si true, le nom du planning inclura la date (ex: "Shift Matinal - 2025-09-26")

#### Format de la réponse

```json
{
    "status": "ok",
    "creePlannings": [
        {
            "id": 123,
            "work_date": "2025-09-26",
            "name": "Shift Matinal - 2025-09-26"
        },
        {
            "id": 124,
            "work_date": "2025-09-27",
            "name": "Shift Matinal - 2025-09-27"
        }
    ],
    "ignores": [],
    "source": {
        "id": 1,
        "name": "Shift Matinal"
    }
}
```

- `status` : État de l'opération ("ok" si succès)
- `creePlannings` : Liste des plannings créés avec succès
- `ignores` : Liste des dates pour lesquelles la duplication a été ignorée (en cas de conflit avec raison)
- `source` : Informations sur le planning source

#### Gestion des Conflits

La duplication vérifie automatiquement les conflits horaires pour les employés. Si un employé est déjà assigné à un autre planning qui chevauche le créneau horaire sur une des nouvelles dates, cette date sera ignorée (ajoutée à `ignores`) pour éviter les conflits d'emploi du temps.