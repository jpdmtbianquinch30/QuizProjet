# Guide de Développement Laravel

## 1. Requêtes Eloquent et Leurs Équivalents SQL

| Méthode Eloquent | Équivalent SQL | Rôle / Utilité |
|-----------------|----------------|----------------|
| `all()` | `SELECT * FROM table;` | Récupère tous les enregistrements |
| `find($id)` | `SELECT * FROM table WHERE id = $id LIMIT 1;` | Récupère une ligne par son ID |
| `findOrFail($id)` | idem que `find` mais si pas trouvé → exception | Sécurise la recherche par ID |
| `first()` | `SELECT * FROM table ORDER BY id ASC LIMIT 1;` | Récupère la **première ligne** |
| `firstOrFail()` | idem que `first` mais exception si vide | Sécurise le `first()` |
| `get()` | `SELECT * FROM table WHERE ...;` | Récupère tous les résultats correspondant |
| `pluck('colonne')` | `SELECT colonne FROM table;` | Récupère seulement une colonne |
| `count()` | `SELECT COUNT(*) FROM table WHERE ...;` | Compte le nombre de résultats |
| `sum('colonne')` | `SELECT SUM(colonne) FROM table;` | Fait la somme d'une colonne |
| `avg('colonne')` | `SELECT AVG(colonne) FROM table;` | Moyenne d'une colonne |
| `max('colonne')` | `SELECT MAX(colonne) FROM table;` | Plus grande valeur d'une colonne |
| `min('colonne')` | `SELECT MIN(colonne) FROM table;` | Plus petite valeur d'une colonne |
| `where('col', '=', $val)` | `WHERE col = $val` | Filtre simple |
| `where('col', '>', $val)` | `WHERE col > $val` | Filtre avec condition |
| `orWhere('col', '=', $val)` | `... OR col = $val` | Ajoute un `OR` |
| `whereBetween('col', [$min, $max])` | `WHERE col BETWEEN $min AND $max` | Vérifie une valeur dans un intervalle |
| `whereIn('col', [a,b,c])` | `WHERE col IN (a,b,c)` | Vérifie si une valeur est dans une liste |
| `whereNotIn('col', [a,b,c])` | `WHERE col NOT IN (a,b,c)` | Exclut une liste de valeurs |
| `whereNull('col')` | `WHERE col IS NULL` | Vérifie si c'est NULL |
| `whereNotNull('col')` | `WHERE col IS NOT NULL` | Vérifie si non NULL |
| `orderBy('col', 'asc')` | `ORDER BY col ASC` | Trie croissant |
| `orderBy('col', 'desc')` | `ORDER BY col DESC` | Trie décroissant |
| `limit($n)` | `LIMIT $n` | Limite le nombre de résultats |
| `offset($n)` | `OFFSET $n` | Décale les résultats |
| `skip($n)` | `OFFSET $n` | Même que `offset` |
| `take($n)` | `LIMIT $n` | Même que `limit` |
| `paginate($n)` | `LIMIT $n OFFSET x` + total count | Pagination automatique |
| `join('table2', 'table1.col', '=', 'table2.col')` | `INNER JOIN table2 ON table1.col = table2.col` | Jointure interne |
| `leftJoin('table2', ...)` | `LEFT JOIN table2 ON ...` | Jointure gauche |
| `rightJoin('table2', ...)` | `RIGHT JOIN table2 ON ...` | Jointure droite |
| `whereHas('relation', fn)` | `WHERE EXISTS (SELECT ... FROM relation ...)` | Filtre en fonction d'une relation |
| `with('relation')` | `LEFT JOIN relation ...` (mais optimisé) | Charge les relations (eager loading) |
| `create([...])` | `INSERT INTO table (col1,col2) VALUES (...);` | Crée une nouvelle ligne |
| `insert([...])` | `INSERT INTO table (col1,col2) VALUES (...);` | Insertion directe (pas d'objets Eloquent) |
| `update([...])` | `UPDATE table SET col=val WHERE ...;` | Met à jour une ou plusieurs lignes |
| `delete()` | `DELETE FROM table WHERE ...;` | Supprime les résultats |
| `destroy($id)` | `DELETE FROM table WHERE id = $id;` | Supprime par ID |
| `truncate()` | `TRUNCATE TABLE table;` | Vide complètement une table |
| `exists()` | `SELECT 1 FROM table WHERE ... LIMIT 1;` | Vérifie si un enregistrement existe |
| `doesntExist()` | Vérifie l'inverse | Vérifie qu'aucun enregistrement n'existe |

## 2. Commandes Artisan Essentielles

1. **Création de modèle avec migration** :
   ```bash
   php artisan make:model Planning -m
   ```
   - Le nom du modèle (Planning) sera aussi utilisé comme nom de table
   - L'option `-m` crée automatiquement la migration associée

2. **Création d'une table pivot** :
   ```bash
   php artisan make:migration create_employee_planning_table --create=employee_planning
   ```
   - Crée une nouvelle migration pour une table pivot
   - Définir les colonnes dans la méthode `up()`

3. **Appliquer les migrations** :
   ```bash
   php artisan migrate
   ```
   - Exécute toutes les migrations en attente

## 3. Relations Many-to-Many avec Table Pivot

### 📌 La Table Pivot `employee_planning`

Cette table intermédiaire gère la relation many-to-many entre employés et plannings.

#### 👉 Pourquoi une table pivot ?

- Un employé peut avoir plusieurs plannings
- Un planning peut avoir plusieurs employés
- Solution flexible et évolutive

#### 👉 Structure

```
employees
  ↓
employee_planning (table pivot)
  ↓
plannings
```

#### 👉 Exemple d'utilisation

```
employee_id = 1, planning_id = 1  → employé 1 dans planning 1
employee_id = 2, planning_id = 1  → employé 2 dans planning 1
employee_id = 2, planning_id = 2  → employé 2 dans planning 2
```

## 4. Environnement de Développement

1. **Tests avec Tinker** :
   ```bash
   php artisan tinker
   ```

2. **Création de contrôleur** :
   ```bash
   php artisan make:controller TestController
   ```

## 5. Routage API vs Web

- **api.php** : Routes préfixées par `/api`
  - Exemple : `http://127.0.0.1:8000/api/employees`
  - Recommandé pour les API REST

- **web.php** : Routes directes
  - Exemple : `http://127.0.0.1:8000/employees`
  - Pour les routes web traditionnelles

## 6. Opérations CRUD

| Action | Méthode Eloquent | Notes |
|--------|------------------|-------|
| Création | `create()` | Nécessite `$fillable` |
| Lecture | `all()`, `get()`, `find()` | `with()` pour relations |
| Modification | `update()` | Utiliser `??` pour valeurs par défaut |
| Suppression | `delete()` | `detach()` pour relations pivot |

## 7. Validation des Données

```php
public function createPlanning(Request $request)
{
    $validateData = $request->validate([
        // règles de validation
    ]);
    // $validateData contient les données validées
}
```

## 8. Gestion du Cache

1. Configuration dans `.env`
2. Import : `use Illuminate\Support\Facades\Cache;`
3. Utilisation :
   ```php
   Cache::remember('key', minutes, function() {
       return $data;
   });
   ```

## 9. Form Requests Personnalisés

```bash
php artisan make:request StoreEmployeeRequest
php artisan make:request StorePlanningRequest
php artisan make:request UpdatePlanningRequest
php artisan make:request AssignEmployeeRequest
php artisan make:request RemoveEmployeesRequest
```

## 10. Tests Feature

```bash
php artisan make:test NomDuTest --feature
```

### Exemple de Test

```php
use RefreshDatabase;

public function test_example()
{
    $response = $this->postJson('/api/employees', $data);
    
    $response->assertStatus(201)
             ->assertJsonFragment(['name' => 'John Doe']);
             
    $this->assertDatabaseHas('employees', [
        'email' => 'john@example.com'
    ]);
}
