
# QuizProjet — Plateforme de Quiz Interactive

Projet réalisé dans le cadre du Master Génie Logiciel
Méthode : **SCRUM** | Sprint 2 (en cours)

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| ADMIN | admin@quiz.com | admin123 |
| EVALUATEUR | evaluateur@quiz.com | evaluateur123 |
| USER | user@quiz.com | user123 |

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Backend | Spring Boot 3.2 + Java 17 |
| Base de données | PostgreSQL 16 |
| Sécurité | Spring Security + JWT |
| Frontend | Angular 20 |
| IA (génération de questions) | Groq API (gratuit — modèle Llama 3.3 70B) |

---

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

### Sprint 2 — Restant à faire
- [ ] Interface USER pour jouer aux quiz (soumission des réponses)
- [ ] Compte à rebours en temps réel côté USER
- [ ] Dashboard Admin complet
- [ ] Interface Client (USER) complète

---

## Prérequis

- Java 17+
- Node.js 20+
- PostgreSQL 16
- Angular CLI 20+
- Maven 3.8+
- Une clé API Groq gratuite (pour la génération IA — voir ci-dessous)

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/jpdmtbianquinch30/QuizProjet.git
cd QuizProjet
```

### 2. Base de données PostgreSQL

```sql
psql -U postgres
CREATE DATABASE quiz_db;
\q
```

### 3. Récupérer une clé API Groq (gratuite, sans carte bancaire)

1. Aller sur https://console.groq.com/keys
2. Se connecter (Google/GitHub)
3. **Create API Key** → copier la clé (commence par `gsk_...`)

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

---

## Créer les comptes en base

```sql
psql -U postgres -d quiz_db

-- Mettre le rôle ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@quiz.com';

-- Mettre le rôle EVALUATEUR
UPDATE users SET role = 'EVALUATEUR' WHERE email = 'evaluateur@quiz.com';
```

---

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
POST  /api/scores                              →  Soumettre les réponses d'un quiz (tous rôles)
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

---

## Structure du projet

```
QuizProjet/
├── QuizProjet_backend/                  ← Spring Boot
│   └── src/main/java/com/master/
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── QuestionnaireController.java
│       │   ├── IaController.java            → Génération IA
│       │   ├── ProfilController.java        → Profil utilisateur
│       │   ├── ScoreController.java         → Scores & classement
│       │   └── GroupeController.java        → Groupes d'apprenants
│       ├── service/
│       │   ├── JwtService.java
│       │   ├── UserService.java
│       │   ├── QuestionnaireService.java
│       │   ├── IaService.java               → Appel API Groq
│       │   ├── ScoreService.java            → Correction & classement
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
│       │   ├── ScoreRepository.java
│       │   └── GroupeRepository.java
│       ├── dto/
│       │   ├── AuthRequest.java / AuthResponse.java
│       │   ├── QuestionnaireRequest.java / QuestionnaireResponse.java
│       │   ├── IaGenerationRequest.java / IaGenerationResponse.java
│       │   ├── ProfilResponse.java / ProfilUpdateRequest.java / ChangerMotDePasseRequest.java
│       │   ├── SoumissionRequest.java / ScoreResponse.java
│       │   └── GroupeRequest.java / GroupeResponse.java / AjouterApprenantsRequest.java / AssignerQuestionnaireRequest.java
│       └── security/
│           ├── SecurityConfig.java
│           ├── JwtAuthenticationFilter.java
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
│       │   └── services/
│       │       ├── auth.ts
│       │       ├── questionnaire.ts
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
│       │   ├── client/
│       │   │   └── client-dashboard/
│       │   ├── evaluateur/
│       │   │   ├── dashboard/               → Dashboard ÉVALUATEUR (4 modules)
│       │   │   ├── profil/                  → Mon profil
│       │   │   ├── classement/              → Classement des scores
│       │   │   ├── groupe-list/             → Liste des groupes
│       │   │   └── groupe-detail/           → Détail groupe + apprenants + quiz assigné
│       │   ├── questionnaire/
│       │   │   ├── questionnaire-list/
│       │   │   └── questionnaire-form/      → + bouton "Générer avec IA"
│       │   └── quiz/
│       │       └── quiz-list/
│       └── shared/
│           └── navbar/
│
└── README.md
```

---

## Notes techniques importantes

- **Lazy loading JPA** : `spring.jpa.open-in-view=false` est activé. Tout service qui accède à des relations `@ManyToOne`/`@ManyToMany` en dehors du repository (ex: `GroupeService`, `ScoreService`, `QuestionnaireService`) doit être annoté `@Transactional`, sinon `LazyInitializationException`.
- **Sécurité** : les clés/secrets (`IA_API_KEY`) doivent toujours être passés en variable d'environnement, jamais commités en dur.
- **CORS** : origine autorisée `http://localhost:4200` (à adapter en production).
```
