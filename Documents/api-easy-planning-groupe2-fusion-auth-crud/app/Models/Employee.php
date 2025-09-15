<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Pour générer facilement de faux employés dans les tests ou seeders.
use Illuminate\Database\Eloquent\Model; // La base de tout les models obligatoires

class Employee extends Model  // Chaque modèle = table dans la BDD donc ici Employee = table employees
{
    
    use HasFactory; // Permet d'utiliser les factories pour générer des données factices

    protected $fillable = ['name', 'email']; // Les champs pouvant être remplis par l'utilisateur, modifiable et protégés

    public function plannings()
    {
        return $this->belongsToMany(Planning::class, 'employee_planning')
                    ->withTimestamps();

        /**
         * employee_planning le nom de la table pivot
         * Planning est la classe Planning qui est dans le fichier Planning.php
         * Ici je dis :
         * Un employé peut avoir plusieurs plannings
         * Et un planning peut concerner plusieurs employés
         * Donc c’est une relation Many-to-Many (beaucoup-à-beaucoup).
         * Laravel va chercher une table pivot appelée employee_planning.
         * Cette table contient les couples (employee_id, planning_id)
         */
    }
}
