<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fonction pour exécuter les migrations et la creation des colonnes de la table plannings
     */
    public function up(): void
    {
        Schema::create('plannings', function (Blueprint $table) {
            $table->id();
            $table->string('name');                     //nom du planning
            $table->date('work_date');                  //date de travail
            $table->time('start_time');                 //heure de début
            $table->time('end_time');                   //heure de fin
            $table->text('notes')->nullable();         //notes
            $table->timestamps();
        });

        /**
         * ceci equivaut en SQL à
         * CREATE TABLE plannings (
         *     id INT AUTO_INCREMENT PRIMARY KEY,
         *     name VARCHAR(255) NOT NULL,
         *     work_date DATE NOT NULL,
         *     start_time TIME NOT NULL,
         *     end_time TIME NOT NULL,
         *     notes TEXT,
         *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         *     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         * );
         */
    }

    public function down(): void
    {
        Schema::dropIfExists('plannings'); // Suppression de la table plannings si elle existe
    }
};
