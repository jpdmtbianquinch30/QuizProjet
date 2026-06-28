# QuizProjet — Plateforme de Quiz Interactive
Projet réalisé dans le cadre du Master Génie Logiciel  
Méthode : **SCRUM** | Sprint 1

---

## Identifiant Admin 
Email : admin@quiz.com
MDP : admin123

---
## Stack Technique
 Backend -------------> Spring Boot 3.2 + Java 17 
 Base de données -----> PostgreSQL 16 
 Sécurité ------------> Spring Security + JWT
 Frontend ------------> Angular 20 

---

## Fonctionnalités Sprint 1
-  Authentification Admin (login / register) ------------------> OK
-  CRUD Questionnaires (Admin) --------------------------------> OK
-  Gestion des questions avec choix multiples -----------------> OK
-  Compte à rebours configurable ------------------------------> OK
-  Statut questionnaire (Brouillon / Publié / Archivé) --------> OK
-  Sécurité JWT -----------------------------------------------> OK

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
git clone https://github.com/TON_USERNAME/QuizProjet.git
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
```

### 4. Lancer le backend
```bash
mvn spring-boot:run
```
Backend disponible sur : http://localhost:8080

--- 

### 5. Lancer le frontend
```bash
cd ../frontend
npm install
ng serve
```
Frontend disponible sur : http://localhost:4200

---

## Compte Admin par défaut

Créer via l'endpoint register puis mettre le rôle ADMIN en base :
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@quiz.com';
```

---

## API Endpoints

### Auth
 POST -------------> /api/auth/register ----->  Créer un compte 
 POST -------------> /api/auth/login --------> Se connecter 

### Questionnaires (Admin)
 GET -----------------> /api/questionnaires ----------> Lister tous 
 GET -----------------> /api/questionnaires/{id} -----> Afficher un 
 POST ----------------> /api/questionnaires ----------> Créer 
 PUT -----------------> /api/questionnaires/{id} -----> Modifier 
 DELETE --------------> /api/questionnaires/{id} -----> Supprimer 

---

## Structure du projet
```
QuizProjet/
├── backend/                    ← Spring Boot
│   └── src/main/java/com/master/
│       ├── controller/
│       ├── service/
│       ├── entity/
│       ├── repository/
│       ├── dto/
│       └── security/
├── frontend/                   ← Angular 20
│   └── src/app/
│       ├── core/
│       ├── features/
│       └── shared/
└── README.md
```