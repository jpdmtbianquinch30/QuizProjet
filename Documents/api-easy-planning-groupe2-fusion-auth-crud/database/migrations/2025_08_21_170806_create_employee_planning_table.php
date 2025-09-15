<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fonction pour exécuter les migrations et la création des colonnes de la table employee_planning
     */
    public function up(): void
    {
        Schema::create('employee_planning', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete(); // Clé étrangère vers la table employees
            $table->foreignId('planning_id')->constrained('plannings')->cascadeOnDelete(); // Clé étrangère vers la table plannings
            $table->unique(['employee_id', 'planning_id']); // Pas de doublons
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_planning'); // Suppression de la table employee_planning si elle existe
    }
};
