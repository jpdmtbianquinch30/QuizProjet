# QuizProjet — Plateforme de Quiz Interactive

Projet réalisé dans le cadre du Master Génie Logiciel
Méthode : SCRUM | Sprint 2 (en cours)

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| ADMIN | admin@quiz.com | admin123 |
| EVALUATEUR | evaluateur@quiz.com | evaluateur123 |
| USER | user@quiz.com | user123 |

## Stack Technique

| Couche | Technologie |
|---|---|
| Backend | Spring Boot 3.2 + Java 17 |
| Base de données | PostgreSQL 16 |
| Sécurité | Spring Security + JWT |
| Frontend | Angular 20 |
| IA (génération de questions) | Groq API (gratuit — modèle Llama 3.3 70B) |

## Fonctionnalités

### Sprint 1
- ✅ Authentification (login / register)
- ✅ CRUD Questionnaires (Évaluateur)
- ✅ Gestion des questions à choix multiples
- ✅ Compte à rebours configurable
- ✅ Statut questionnaire (Brouillon / Publié / Archivé)
- ✅ Sécurité JWT
- ✅ 3 rôles : ADMIN / EVALUATEUR / USER
- ✅ Dashboard Évaluateur

### Sprint 2 (SCRUM-20 — Évaluateur)
- ✅ Génération de questions par IA (Groq, gratuit)
- ✅ Gestion du profil Évaluateur (infos + changement de mot de passe)
- ✅ Consultation du classement des scores par questionnaire
- ✅ Création de groupes d'apprenants + assignation de questionnaire

### Sprint 2 (SCRUM-19 — Apprenant)
- ✅ Consultation des questionnaires assignés (via appartenance à un groupe)
- ✅ Démarrage d'un quiz avec compte à rebours en temps réel (soumission automatique à expiration)
- ✅ Vérification de chaque réponse au moment du choix, avec feedback visuel (bordure verte si correct, rouge si incorrect, bonne réponse surlignée en cas d'erreur)
- ✅ Réponse verrouillée après un premier choix par question (pas de retour en arrière possible sur une question)
- ✅ Soumission des réponses et calcul automatique du score
- ✅ Blocage d'une seconde tentative sur un même questionnaire déjà complété (contrôle backend + frontend)
- ✅ Historique des résultats de l'apprenant (score, pourcentage, date)
- ✅ Dashboard Apprenant harmonisé avec le design du dashboard Évaluateur

## Prérequis

- Java 17+
- Node.js 20+
- PostgreSQL 16
- Angular CLI 20+
- Maven 3.8+
- Une clé API Groq gratuite (pour la génération IA — voir ci-dessous)

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/jpdmtbianquinch30/QuizProjet.git
cd QuizProjet
```

### 2. Base de données PostgreSQL

```bash
psql -U postgres
CREATE DATABASE quiz_db;
\q
```

### 3. Récupérer une clé API Groq (gratuite, sans carte bancaire)

- Aller sur https://console.groq.com/keys
- Se connecter (Google/GitHub)
- Create API Key → copier la clé (commence par `gsk_...`)

### 4. Configurer le backend

```bash
cd QuizProjet_backend
```

Modifier `src/main/resources/application.properties` (adapter le mot de passe PostgreSQL) :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/quiz_db
spring.datasource.username=postgres
spring.datasource.password=TON_MOT_DE_PASSE
app.jwt.secret=QuizProjetSecretKeyPourJWTdoitEtreAssezLongue2024!
app.jwt.expiration=86400000
server.port=8080

app.ia.api.key=${IA_API_KEY:}
app.ia.api.url=https://api.groq.com/openai/v1/chat/completions
app.ia.model=llama-3.3-70b-versatile
```

Définir la variable d'environnement avec ta clé Groq avant de lancer le backend :

**PowerShell (Windows) :**
```powershell
$env:IA_API_KEY="gsk_ta_cle_ici"
```

**Bash (Linux/Mac) :**
```bash
export IA_API_KEY=gsk_ta_cle_ici
```

> Sans cette variable, tout le reste du projet fonctionne normalement — seul le bouton "Générer avec IA" renverra une erreur explicite.

### 5. Lancer le backend

```bash
mvn spring-boot:run
```

Backend disponible sur : http://localhost:8080

### 6. Lancer le frontend

```bash
cd ../frontend
npm install --legacy-peer-deps
ng serve
```

Frontend disponible sur : http://localhost:4200

### Créer les comptes en base

```sql
psql -U postgres -d quiz_db

-- Mettre le rôle ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@quiz.com';

-- Mettre le rôle EVALUATEUR
UPDATE users SET role = 'EVALUATEUR' WHERE email = 'evaluateur@quiz.com';
```

## API Endpoints

### Auth
```
POST  /api/auth/register  →  Créer un compte
POST  /api/auth/login     →  Se connecter
```

### Questionnaires (EVALUATEUR + ADMIN)
```
GET     /api/questionnaires          →  Lister (les siens pour EVALUATEUR, tous pour ADMIN)
GET     /api/questionnaires/{id}     →  Afficher un
POST    /api/questionnaires          →  Créer
PUT     /api/questionnaires/{id}     →  Modifier
DELETE  /api/questionnaires/{id}     →  Supprimer
GET     /api/questionnaires/recherche?theme=...  →  Rechercher par thème
GET     /api/questionnaires/publies  →  Lister publiés (USER + EVALUATEUR + ADMIN)
```

### Questionnaires — Apprenant (USER)
```
GET  /api/questionnaires/assignes    →  Lister les questionnaires assignés (via ses groupes), sans les bonnes réponses
GET  /api/questionnaires/{id}/jouer  →  Récupérer un questionnaire pour le jouer (403 si non assigné, 409 si déjà complété)
```

### Questions — Vérification en temps réel (tous rôles authentifiés)
```
POST  /api/questions/{id}/verifier  →  { choixIndex } → { correcte, bonneReponseIndex }
```
> Utilisé pour le feedback visuel immédiat pendant le quiz, sans exposer les autres bonnes réponses du questionnaire.

### IA — Génération de questions (EVALUATEUR + ADMIN)
```
POST  /api/ia/generer  →  { theme, nombreQuestions, niveau } → questions générées
```

### Profil (tout utilisateur connecté)
```
GET  /api/profil                →  Voir son profil
PUT  /api/profil                →  Modifier nom / prénom
PUT  /api/profil/mot-de-passe   →  Changer le mot de passe
```

### Scores / Classement
```
POST  /api/scores                              →  Soumettre les réponses d'un quiz (tous rôles, 409 si déjà soumis pour ce questionnaire)
GET   /api/scores/classement/{questionnaireId} →  Classement d'un questionnaire (EVALUATEUR + ADMIN)
GET   /api/scores/mon-historique               →  Historique de l'utilisateur connecté
```

### Groupes d'apprenants (EVALUATEUR + ADMIN)
```
GET     /api/groupes                            →  Lister (les siens / tous pour ADMIN)
GET     /api/groupes/{id}                       →  Afficher un
POST    /api/groupes                            →  Créer { nom, description }
PUT     /api/groupes/{id}                       →  Modifier
DELETE  /api/groupes/{id}                       →  Supprimer
POST    /api/groupes/{id}/apprenants            →  Ajouter des apprenants { emails: [...] }
DELETE  /api/groupes/{id}/apprenants/{userId}   →  Retirer un apprenant
PUT     /api/groupes/{id}/questionnaire         →  Assigner un questionnaire { questionnaireId }
```

## Structure du projet

```
QuizProjet/
├── QuizProjet_backend/                  ← Spring Boot
│   └── src/main/java/com/master/
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── QuestionnaireController.java  → + endpoints /assignes, /{id}/jouer
│       │   ├── QuestionController.java       → Vérification de réponse en temps réel
│       │   ├── IaController.java             → Génération IA
│       │   ├── ProfilController.java         → Profil utilisateur
│       │   ├── ScoreController.java          → Scores & classement, blocage re-tentative
│       │   └── GroupeController.java         → Groupes d'apprenants
│       ├── service/
│       │   ├── JwtService.java
│       │   ├── UserService.java
│       │   ├── QuestionnaireService.java     → + listerAssignes(), findByIdPourApprenant()
│       │   ├── IaService.java                → Appel API Groq
│       │   ├── ScoreService.java             → Correction, classement, blocage doublon
│       │   └── GroupeService.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── Questionnaire.java
│       │   ├── Question.java
│       │   ├── Score.java
│       │   └── Groupe.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── QuestionnaireRepository.java
│       │   ├── QuestionRepository.java
│       │   ├── ScoreRepository.java          → + existsByUserIdAndQuestionnaireId()
│       │   └── GroupeRepository.java         → + findByApprenantId()
│       ├── dto/
│       │   ├── AuthRequest.java / AuthResponse.java
│       │   ├── QuestionnaireRequest.java / QuestionnaireResponse.java
│       │   ├── IaGenerationRequest.java / IaGenerationResponse.java
│       │   ├── ProfilResponse.java / ProfilUpdateRequest.java / ChangerMotDePasseRequest.java
│       │   ├── SoumissionRequest.java / ScoreResponse.java
│       │   ├── VerifierReponseRequest.java / VerifierReponseResponse.java
│       │   └── GroupeRequest.java / GroupeResponse.java / AjouterApprenantsRequest.java / AssignerQuestionnaireRequest.java
│       └── security/
│           ├── SecurityConfig.java
│           ├── JwtAuthenticationFilter.java   → Tolérance aux tokens invalides/malformés
│           └── CustomUserDetailsService.java
│
├── frontend/                            ← Angular 20
│   └── src/app/
│       ├── core/
│       │   ├── guards/
│       │   │   ├── auth-guard.ts
│       │   │   └── evaluateur-guard.ts
│       │   ├── interceptors/
│       │   │   └── auth-interceptor.ts
│       │   ├── models/
│       │   │   └── quiz.ts                  → QuestionDTO, QuestionnaireResponse, ScoreResponse...
│       │   └── services/
│       │       ├── auth.ts
│       │       ├── questionnaire.ts
│       │       ├── quiz.ts                  → Questionnaires assignés, jeu, soumission, historique
│       │       ├── ia.ts                    → Génération IA
│       │       ├── profil.ts                → Profil utilisateur
│       │       ├── score.ts                 → Scores & classement
│       │       └── groupe.ts                → Groupes d'apprenants
│       ├── features/
│       │   ├── admin/
│       │   │   └── admin-dashboard/
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   └── register/
│       │   ├── client/                      → Espace Apprenant
│       │   │   ├── client-dashboard/        → Dashboard Apprenant (même design que Évaluateur)
│       │   │   ├── quiz-list/               → Liste des questionnaires assignés
│       │   │   ├── quiz-play/               → Jeu avec compte à rebours + feedback vert/rouge
│       │   │   ├── quiz-result/             → Résultat final après soumission
│       │   │   └── quiz-historique/         → Historique des scores de l'apprenant
│       │   ├── evaluateur/
│       │   │   ├── dashboard/               → Dashboard ÉVALUATEUR (4 modules)
│       │   │   ├── profil/                  → Mon profil
│       │   │   ├── classement/              → Classement des scores
│       │   │   ├── groupe-list/             → Liste des groupes
│       │   │   └── groupe-detail/           → Détail groupe + apprenants + quiz assigné
│       │   └── questionnaire/
│       │       ├── questionnaire-list/
│       │       └── questionnaire-form/      → + bouton "Générer avec IA"
│       └── shared/
│           └── navbar/
│
└── README.md
```

## Notes techniques importantes

- **Lazy loading JPA** : `spring.jpa.open-in-view=false` est activé. Tout service qui accède à des relations `@ManyToOne`/`@ManyToMany` en dehors du repository (ex: `GroupeService`, `ScoreService`, `QuestionnaireService`) doit être annoté `@Transactional`, sinon `LazyInitializationException`.
- **Sécurité** : les clés/secrets (`IA_API_KEY`) doivent toujours être passés en variable d'environnement, jamais commités en dur.
- **CORS** : origine autorisée `http://localhost:4200` (à adapter en production).
- **Assignation des questionnaires** : un questionnaire n'est jamais assigné directement à un apprenant, mais à un **groupe** (`Groupe.questionnaireAssigne`). Un apprenant voit un questionnaire dès lors qu'il appartient à un groupe auquel ce questionnaire est assigné, et uniquement si le statut du questionnaire est `PUBLIE`.
- **Anti-triche** : l'endpoint `/api/questionnaires/{id}/jouer` masque systématiquement `bonneReponseIndex` dans sa réponse JSON. La vérification d'une réponse se fait via un appel dédié (`/api/questions/{id}/verifier`) au moment où l'apprenant clique, question par question — jamais toutes les corrections envoyées d'un coup.
- **Unicité de tentative** : un apprenant ne peut soumettre qu'une seule fois ses réponses pour un questionnaire donné (`ScoreRepository.existsByUserIdAndQuestionnaireId`). Une tentative d'accès ou de soumission après complétion renvoie un statut `409 Conflict`, géré côté frontend par une redirection automatique vers l'historique.
