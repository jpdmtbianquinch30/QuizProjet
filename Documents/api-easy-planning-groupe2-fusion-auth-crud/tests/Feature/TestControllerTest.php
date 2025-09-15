<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Employee;
use \App\Models\Planning;
use Illuminate\Support\Facades\Cache;

class TestControllerTest extends TestCase
{
    use RefreshDatabase; // Utilise une base de données en mémoire pour les tests

    /** @test */
    public function test_cree_un_employe()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ];

        $response = $this->postJson('/api/employees', $data);
        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'John Doe']);

        $this->assertDatabaseHas('employees', [
            'email' => 'john@example.com'
        ]);
    }

    public function test_creates_un_planning()
    {
        // Créer les employés qui seront assignés
        $employee1 = Employee::create(['name' => 'Mahamane Korobara', 'email' => 'mahamane@example.com']);
        $employee2 = Employee::create(['name' => 'Aissata Tounkara', 'email' => 'aissata@example.com']);

        // Préparer les données pour le planning
        $data = [
            'name'       => 'Shift Matinal',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
            'employees'  => [$employee1->id, $employee2->id],
            'notes'      => 'Préférences : pas de pauses',
        ];

        // Envoyer la requête POST
        $response = $this->postJson('/api/plannings', $data);

        // Vérifier que le status HTTP est 201
        $response->assertStatus(201);

        // Vérifier que la réponse JSON contient le nom du planning
        $response->assertJsonFragment(['name' => 'Shift Matinal']);

        // Vérifier la table plannings
        $planningId = $response->json('id');
        $this->assertDatabaseHas('plannings', [
            'id'         => $planningId,
            'name'       => 'Shift Matinal',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
            'notes'      => 'Préférences : pas de pauses',
        ]);

        // Vérifier la table pivot
        foreach ($data['employees'] as $employeeId) {
            $this->assertDatabaseHas('employee_planning', [
                'planning_id' => $planningId,
                'employee_id' => $employeeId,
            ]);
        }
    }

    public function test_assigne_un_employe_au_planning()
    {
        // Créer un employé et un planning
        $employee = Employee::create(['name' => 'Mahamane Korobara', 'email' => 'mahamane@example.com']);
        $planning = Planning::create([
            'name'       => 'Shift Matinal',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
            'notes'      => 'Préférences : pas de pauses',
        ]);

        $data = [
            'employee_id' => $employee->id,
        ];

        $response = $this->postJson("/api/plannings/{$planning->id}/assigne", $data);
        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Employé ajouté au planning avec succès']);
        /**
         * Vérifie que dans la table employee_planning, il existe une ligne où planning_id = l’ID de mon planning créé, et employee_id = l’ID de l’employé que j’ai assigné
         * Pour s'assurer que l'affectation a bien été réalisée
         */
        $this->assertDatabaseHas('employee_planning', [
            'planning_id' => $planning->id,
            'employee_id' => $employee->id,
        ]);

    }

    public function test_conflit_detecte_meme_journee()
    {
        $employee = Employee::create(['name' => 'Worker', 'email' => 'worker@example.com']);

        // Premier planning 08h–12h
        $planning1 = Planning::create([
            'name'       => 'Shift Matin',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
        ]);
        $planning1->employees()->attach($employee->id);

        // Deuxième planning 10h–14h (conflit)
        $planning2 = Planning::create([
            'name'       => 'Shift Midi',
            'work_date'  => '2025-09-25',
            'start_time' => '10:00:00',
            'end_time'   => '14:00:00',
        ]);

        $data = [
            'employee_id' => $employee->id,
        ];

        $res = $this->postJson("/api/plannings/{$planning2->id}/assigne", $data);

        $res->assertStatus(400)
            ->assertJsonFragment([
                'status' => 'error',
            ]);
    }

    public function test_conflit_detecte_shift_traverse_minuit()
    {
        $employee = Employee::create(['name' => 'Night Worker', 'email' => 'night@example.com']);

        // Planning 22h–06h (25 sept → 26 sept)
        $planning = Planning::create([
            'name'       => 'Shift Nuit',
            'work_date'  => '2025-09-25',
            'start_time' => '22:00:00',
            'end_time'   => '06:00:00',
        ]);
        $planning->employees()->attach($employee->id);

        // Planning 26 sept, 02h–04h (conflit car chevauche avec le shift nuit)
        $conflict = Planning::create([
            'name'       => 'Conflit Matin',
            'work_date'  => '2025-09-26',
            'start_time' => '02:00:00',
            'end_time'   => '04:00:00',
        ]);
        
        $data = [
            'employee_id' => $employee->id,
        ];

        $res = $this->postJson("/api/plannings/{$conflict->id}/assigne", $data);

        $res->assertStatus(400)
            ->assertJsonFragment([
                'status' => 'error',
            ]);
    }
    
    public function test_modifie_un_planning()
    {
        // Créer un planning
        $planning = Planning::create([
            'name'       => 'Shift Matinal',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
            'notes'      => 'Préférences : pas de pauses',
        ]);

        // Préparer les données de mise à jour
        $data = [
            'name'       => 'Shift Après-midi',
            'work_date'  => '2025-09-26',
            'start_time' => '13:00:00',
            'end_time'   => '17:00:00',
            'notes'      => 'Nouvelles notes pour le shift après-midi',
        ];

        // Envoyer la requête PUT pour mettre à jour le planning
        $response = $this->putJson("/api/plannings/{$planning->id}", $data);

        // Vérifier que le status HTTP est 200
        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Shift Après-midi']);

        // Vérifier que la base de données a été mise à jour correctement
        $this->assertDatabaseHas('plannings', [
            'id'         => $planning->id,
            'name'       => 'Shift Après-midi',
            'work_date'  => '2025-09-26',
            'start_time' => '13:00:00',
            'end_time'   => '17:00:00',
            'notes'      => 'Nouvelles notes pour le shift après-midi',
        ]);
    }

    public function test_duplication_de_planning_sur_plusieurs_dates()
    {
        $this->withoutExceptionHandling();

        // Employé + planning source
        $emp = Employee::create(['name' => 'Dup Emp', 'email' => 'dup@example.com']);
        $sourcePlanning = Planning::create([
            'name'       => 'Shift Matinal',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
            'notes'      => 'Note source',
        ]);
        $sourcePlanning->employees()->attach($emp->id);

        $payload = [
            'new_date'      => ['2025-09-26', '2025-09-27'],
            'include_employees' => true,
            'rename_with_date'  => true,
        ];

        $res = $this->postJson("/api/plannings/{$sourcePlanning->id}/duplicate", $payload);

        $res->assertStatus(201)
            ->assertJsonStructure([
                'status', 'creePlannings' => [['id','work_date','name']], 'ignores', 'source'
            ]);

        // Vérifier BDD
        $this->assertDatabaseHas('plannings', [
            'work_date' => '2025-09-26',
            'name'      => 'Shift Matinal - 2025-09-26',
        ]);
        $this->assertDatabaseHas('employee_planning', [
            'employee_id' => $emp->id,
            // planning_id sera un des nouveaux ids — on vérifie via count simple :
        ]);

        // 2 créations attendues
        $this->assertCount(2, $res->json('creePlannings'));
    }

    public function test_duplication_skip_si_conflit()
    {
        $emp = Employee::create(['name' => 'Emp', 'email' => 'emp@example.com']);
        $sourcePlanning = Planning::create([
            'name'       => 'Shift',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
            'notes'      => null,
        ]);
        $sourcePlanning->employees()->attach($emp->id);

        // On crée un planning CONFLICTUEL pour 2025-09-26 (même créneau & même employé)
        $conflict = Planning::create([
            'name'       => 'Autre',
            'work_date'  => '2025-09-26',
            'start_time' => '09:00:00',
            'end_time'   => '11:00:00',
            'notes'      => null,
        ]);
        $conflict->employees()->attach($emp->id);

        $payload = [
            'new_date'      => ['2025-09-26', '2025-09-27'],
            'include_employees' => true,
        ];

        $res = $this->postJson("/api/plannings/{$sourcePlanning->id}/duplicate", $payload);

        $res->assertStatus(201)
            ->assertJson(fn ($json) =>
                $json->where('status', 'ok')
                    ->has('creePlannings', 1) // 27 créée
                    ->has('ignores', 1) // 26 sautée
                    ->has('source')
            );

        // La 27 existe
        $this->assertDatabaseHas('plannings', [
            'work_date'  => '2025-09-27',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
        ]);

        // La 26 n’a PAS été créée (il y en a déjà une conflictuel, pas de doublon)
        $this->assertEquals(
            1,
            Planning::where('work_date', '2025-09-26')->count()
        );
    }

    public function test_supprime_un_employee_dun_planning() 
    {
        // Créer un employé et un planning
        $employee = Employee::create(['name' => 'Mahamane Korobara', 'email' => 'mahamane@example.com']);
        $planning = Planning::create([
            'name'       => 'Shift Matinal',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
            'notes'      => 'Préférences : pas de pauses',
        ]);

        // Assigner l'employé au planning
        $planning->employees()->attach($employee);

        $response = $this->deleteJson("/api/plannings/{$planning->id}/employees", [
            'employees' => [$employee->id]
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Employés retirés du planning avec succès']);

        $this->assertDatabaseMissing('employee_planning', [
            'planning_id' => $planning->id,
            'employee_id' => $employee->id,
        ]);
    }

    public function test_supprimer_un_planning()
    {
        $planning = Planning::create([
            'name'       => 'Shift Matinal',
            'work_date'  => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time'   => '12:00:00',
            'notes'      => 'Préférences : pas de pauses',
        ]);

        $response = $this->deleteJson("/api/plannings/{$planning->id}");
        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => "Planning ID {$planning->id} supprimé avec succès."]);
    }

    // Tests de validation et cas d'erreur
    public function test_creation_employee_avec_donnees_invalides()
    {
        $data = [
            'name' => '', // nom vide
            'email' => 'email-invalide', // email invalide
        ];

        $response = $this->postJson('/api/employees', $data);
        $response->assertStatus(422) // Validation error
                ->assertJsonValidationErrors(['name', 'email']);
    }

    public function test_creation_employee_avec_email_duplique()
    {
        // Créer un premier employé
        Employee::create(['name' => 'Mahamane Korobara', 'email' => 'mahamane@example.com']);

        // Tentative de création avec le même email
        $data = [
            'name' => 'Jane Doe',
            'email' => 'mahamane@example.com', // Email déjà utilisé
        ];

        $response = $this->postJson('/api/employees', $data);
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    public function test_creation_planning_avec_donnees_invalides()
    {
        $data = [
            'name' => '', // nom vide
            'work_date' => 'date-invalide',
            'start_time' => '25:00:00', // heure invalide
            'end_time' => '08:00:00', // fin avant début
            'employees' => [999], // employé inexistant
        ];

        $response = $this->postJson('/api/plannings', $data);
        $response->assertStatus(422);
    }

    public function test_assignation_employe_inexistant_au_planning()
    {
        $planning = Planning::create([
            'name' => 'Test Planning',
            'work_date' => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
        ]);

        $data = ['employee_id' => 999]; // ID inexistant

        $response = $this->postJson("/api/plannings/{$planning->id}/assigne", $data);
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['employee_id']);
    }

    public function test_assignation_a_planning_inexistant()
    {
        $employee = Employee::create(['name' => 'Test', 'email' => 'test@example.com']);
        $data = ['employee_id' => $employee->id];

        $response = $this->postJson("/api/plannings/999/assigne", $data);
        $response->assertStatus(404);
    }

    // Tests de récupération des données
    public function test_liste_tous_les_employees()
    {
        Cache::forget('employees.index'); // vider le cache

        Employee::truncate(); // reset la table pour éviter des doublons
        Employee::create(['name' => 'Mahamane Korobara', 'email' => 'mahamane@example.com']);
        Employee::create(['name' => 'Aissata Tounkara', 'email' => 'aissata@example.com']);

        $response = $this->getJson('/api/employees');

        $response->assertStatus(200)
                ->assertJsonCount(2); // car la réponse est un tableau brut
    }


    public function test_liste_tous_les_plannings()
    {
        Cache::forget('plannings.index'); // vider le cache

        Planning::truncate(); // reset la table pour éviter des doublons
        Planning::create([
            'name' => 'Planning 1',
            'work_date' => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
        ]);

        Planning::create([
            'name' => 'Planning 2',
            'work_date' => '2025-09-26',
            'start_time' => '13:00:00',
            'end_time' => '17:00:00',
        ]);

        $response = $this->getJson('/api/plannings');
        $response->assertStatus(200)
                ->assertJsonCount(2, 'data'); // La clé data ajouté avec la ressource
    }

    // Version simple et robuste
    public function test_affiche_un_planning_avec_employes()
    {
        $employee1 = Employee::create(['name' => 'Mahamane Korobara', 'email' => 'mahamane@example.com']);
        $employee2 = Employee::create(['name' => 'Aissata Tounkara', 'email' => 'aissata@example.com']);
        
        $planning = Planning::create([
            'name' => 'Test Planning',
            'work_date' => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
        ]);
        
        $planning->employees()->attach([$employee1->id, $employee2->id]);

        $response = $this->getJson("/api/plannings/{$planning->id}");
        
        // Vérifier que la réponse est OK et contient le planning
        $response->assertStatus(200)
                ->assertJsonFragment(['name' => 'Test Planning']);
        
        // Vérifier que les employés sont bien attachés en base
        $this->assertCount(2, $planning->fresh()->employees);
        
        // Vérifier que les noms des employés apparaissent dans la réponse JSON
        $responseContent = $response->getContent();
        $this->assertStringContainsString('Mahamane Korobara', $responseContent);
        $this->assertStringContainsString('Aissata Tounkara', $responseContent);
    }

    // Tests de mise à jour
    public function test_modification_planning_inexistant()
    {
        $data = [
            'name' => 'Planning modifié',
            'work_date' => '2025-09-26',
            'start_time' => '13:00:00',
            'end_time' => '17:00:00',
        ];

        $response = $this->putJson('/api/plannings/999', $data);
        $response->assertStatus(404);
    }

    public function test_supprime_planning_inexistant()
    {
        $response = $this->deleteJson('/api/plannings/999');
        $response->assertStatus(404);
    }

    // Tests de cas pour la duplication

    public function test_duplication_avec_dates_invalides()
    {
        $planning = Planning::create([
            'name' => 'Test Planning',
            'work_date' => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
        ]);

        $payload = [
            'new_date' => ['date-invalide', '2025-13-40'], // dates invalides
            'include_employees' => true,
        ];

        $response = $this->postJson("/api/plannings/{$planning->id}/duplicate", $payload);
        $response->assertStatus(422);
    }

    public function test_duplication_sans_nouvelles_dates()
    {
        $planning = Planning::create([
            'name' => 'Test Planning',
            'work_date' => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
        ]);

        $payload = [
            'new_date' => [], // tableau vide
            'include_employees' => true,
        ];

        $response = $this->postJson("/api/plannings/{$planning->id}/duplicate", $payload);
        $response->assertStatus(422);
    }
    

    // Test de conflits plus complexes
    public function test_pas_de_conflit_shifts_consecutifs()
    {
        $employee = Employee::create(['name' => 'Worker', 'email' => 'worker@example.com']);

        // Premier shift 08h–12h
        $planning1 = Planning::create([
            'name' => 'Shift Matin',
            'work_date' => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
        ]);
        $planning1->employees()->attach($employee->id);

        // Deuxième shift 12h–16h (pas de conflit, juste consécutif)
        $planning2 = Planning::create([
            'name' => 'Shift Après-midi',
            'work_date' => '2025-09-25',
            'start_time' => '12:00:00',
            'end_time' => '16:00:00',
        ]);

        $response = $this->postJson("/api/plannings/{$planning2->id}/assigne", [
            'employee_id' => $employee->id,
        ]);

        $response->assertStatus(200); // Pas de conflit
    }

    public function test_conflit_shifts_differents_jours_normaux()
    {
        $employee = Employee::create(['name' => 'Worker', 'email' => 'worker@example.com']);

        // Shift jour 1
        $planning1 = Planning::create([
            'name' => 'Shift J1',
            'work_date' => '2025-09-25',
            'start_time' => '08:00:00',
            'end_time' => '16:00:00',
        ]);
        $planning1->employees()->attach($employee->id);

        // Shift jour 2 (pas de conflit)
        $planning2 = Planning::create([
            'name' => 'Shift J2',
            'work_date' => '2025-09-26',
            'start_time' => '08:00:00',
            'end_time' => '16:00:00',
        ]);

        $response = $this->postJson("/api/plannings/{$planning2->id}/assigne", [
            'employee_id' => $employee->id,
        ]);

        $response->assertStatus(200); // Pas de conflit entre différents jours normaux
    }

}
