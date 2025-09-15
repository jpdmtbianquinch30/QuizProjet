<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Pour générer facilement de faux employés dans les tests ou seeders.
use Illuminate\Database\Eloquent\Model; // La base de tout les models obligatoires

class Planning extends Model
{
    use HasFactory; // Permet d'utiliser les factories pour générer des données factices

    protected $fillable = [
        'name',
        'work_date',
        'start_time',
        'end_time',
        'notes'                   // Optionnel
    ];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_planning')
                    ->withTimestamps();
    }
}
