Voici le README mis à jour :

```markdown
# QuizProjet — Plateforme de Quiz Interactive

Projet réalisé dans le cadre du Master Génie Logiciel  
Méthode : **SCRUM** | Sprint 1

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| ADMIN | admin@quiz.com | admin123 |
| EVALUATEUR | evaluateur@quiz.com | evaluateur123 |
| USER | jean@gmail.com | jean123 |

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Backend | Spring Boot 3.2 + Java 17 |
| Base de données | PostgreSQL 16 |
| Sécurité | Spring Security + JWT |
| Frontend | Angular 20 |

---

## Fonctionnalités Sprint 1

- ✅ Authentification (login / register)
- ✅ CRUD Questionnaires (Évaluateur)
- ✅ Gestion des questions avec choix multiples
- ✅ Compte à rebours configurable
- ✅ Statut questionnaire (Brouillon / Publié / Archivé)
- ✅ Sécurité JWT
- ✅ 3 rôles : ADMIN / EVALUATEUR / USER
- ✅ Dashboard Évaluateur
- ✅ Dashboard Admin (en cours)
- ✅ Interface Client (en cours)

---

## Prérequis

- Java 17+
- Node.js 20+
- PostgreSQL 16
- Angular CLI 20+
- Maven 3.8+

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

### 3. Configurer le backend

```bash
cd QuizProjet_backend
```

Modifier `src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/quiz_db
spring.datasource.username=postgres
spring.datasource.password=TON_MOT_DE_PASSE
app.jwt.secret=QuizProjetSecretKeyPourJWTdoitEtreAssezLongue2024!
app.jwt.expiration=86400000
server.port=8080
```

### 4. Lancer le backend

```bash
mvn spring-boot:run
```

Backend disponible sur : http://localhost:8080

### 5. Lancer le frontend

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

---

## API Endpoints

### Auth
```
POST  /api/auth/register  →  Créer un compte
POST  /api/auth/login     →  Se connecter
```

### Questionnaires (EVALUATEUR + ADMIN)
```
GET     /api/questionnaires          →  Lister tous
GET     /api/questionnaires/{id}     →  Afficher un
POST    /api/questionnaires          →  Créer
PUT     /api/questionnaires/{id}     →  Modifier
DELETE  /api/questionnaires/{id}     →  Supprimer
GET     /api/questionnaires/publies  →  Lister publiés (USER)
```

---

## Structure du projet

```
QuizProjet/
├── QuizProjet_backend/              ← Spring Boot
│   └── src/main/java/com/master/
│       ├── controller/
│       │   ├── AuthController.java
│       │   └── QuestionnaireController.java
│       ├── service/
│       │   ├── JwtService.java
│       │   ├── UserService.java
│       │   └── QuestionnaireService.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── Questionnaire.java
│       │   └── Question.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── QuestionnaireRepository.java
│       │   └── QuestionRepository.java
│       ├── dto/
│       │   ├── AuthRequest.java
│       │   ├── AuthResponse.java
│       │   ├── QuestionnaireRequest.java
│       │   └── QuestionnaireResponse.java
│       └── security/
│           ├── SecurityConfig.java
│           ├── JwtAuthenticationFilter.java
│           └── CustomUserDetailsService.java
│
├── frontend/                        ← Angular 20
│   └── src/app/
│       ├── core/
│       │   ├── guards/
│       │   │   ├── auth-guard.ts        → Protège routes USER
│       │   │   └── evaluateur-guard.ts  → Protège routes EVALUATEUR/ADMIN
│       │   ├── interceptors/
│       │   │   └── auth-interceptor.ts  → JWT automatique
│       │   └── services/
│       │       ├── auth.ts              → Login/Register/Logout
│       │       └── questionnaire.ts     → CRUD questionnaires
│       ├── features/
│       │   ├── admin/
│       │   │   └── admin-dashboard/     → 🛡️ Espace ADMIN
│       │   ├── auth/
│       │   │   ├── login/               → 🔐 Connexion
│       │   │   └── register/            → 📝 Inscription
│       │   ├── client/
│       │   │   └── client-dashboard/    → 👤 Espace USER
│       │   ├── evaluateur/
│       │   │   └── dashboard/           → 📊 Dashboard ÉVALUATEUR
│       │   ├── questionnaire/
│       │   │   ├── questionnaire-list/  → 📋 Liste questionnaires
│       │   │   └── questionnaire-form/  → ✏️ Créer/Modifier
│       │   └── quiz/
│       │       └── quiz-list/           → 🎯 Liste quiz USER
│       └── shared/
│           └── navbar/                  → 🔝 Navigation
│
└── README.md
```

---

## Sprint 2 — À développer

- [ ] Interface USER pour jouer aux quiz
- [ ] Compte à rebours en temps réel
- [ ] Classement des scores
- [ ] Intégration IA pour générer des questions
- [ ] Gestion des comptes (ADMIN)
- [ ] Profil utilisateur
