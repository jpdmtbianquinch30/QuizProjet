<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; // A ne pas oublié pour l'enregistrement d'un employée dans la BDD
use App\Models\Employee;
use App\Models\Planning;
use App\Http\Resources\PlanningResource;
use App\Helpers\Helper;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\StorePlanningRequest;
use App\Http\Requests\UpdatePlanningRequest;
use App\Http\Requests\AssignEmployeeRequest;
use App\Http\Requests\RemoveEmployeesRequest;
use App\Http\Requests\DuplicatePlanningRequest;

class TestController extends Controller
{

    use Helper;
    // LA PARTIE CREATION DE PLANNINGS

    // Récupérer tous les employés
    public function getEmployees()
    {
        return Cache::remember('employees.index', now()->addMinutes(10), function () {
            return Employee::with('plannings')->get();
        });
    }

    // Récupérer tous les plannings avec les employés associés
    public function getPlannings()
    {
         return Cache::remember('plannings.index', now()->addMinutes(10), function () {
            return PlanningResource::collection(Planning::with('employees')->get()); // 

        });
    }

    // Récupérer un planning spécifique
    public function getPlanning($planningId)
    {
        return Cache::remember("planning.$planningId", now()->addMinutes(10), function () use ($planningId) {
            $planning = Planning::with('employees')->findOrFail($planningId);
            return new PlanningResource($planning); // Pour un seul planning
        });
    }


    // Creation d'un nouvel employé
    public function createEmployee(StoreEmployeeRequest $request)
    {
        //Validation des données réçus
        $validateData = $request->validated();

        // Créer un employé
        $employee = Employee::create($validateData);
        $this->bustPlanningCaches(); // invalider employees.index et plannings.index car ceci change
        return response()->json($employee, 201);
    }

    public function createPlanning(StorePlanningRequest $request)
    {
        // Validation des données reçues
        $validateData = $request->validated();

        // Vérifier la disponibilité de chaque employé
        foreach ($validateData['employees'] as $employeeId) {
            $conflict = $this->checkConflict(
                $employeeId,
                $validateData['work_date'],
                $validateData['start_time'],
                $validateData['end_time']
            );

            if ($conflict) {
                return response()->json([
                    'status' => 'error',
                    'message' => "L'employé avec l'ID {$employeeId} est déjà assigné à un planning à ce créneau"
                ], 400);
            }
        }


        // Créer le planning
        $planning = Planning::create([
            'name'       => $validateData['name'],
            'work_date'  => $validateData['work_date'],
            'start_time' => $validateData['start_time'],
            'end_time'   => $validateData['end_time'],
            'notes'      => $validateData['notes'] ?? null,
        ]);

        // Associer les employés au planning
        $planning->employees()->attach($validateData['employees']);
        $this->bustPlanningCaches($planning->id);
        return response()->json($planning->load('employees'), 201);
    }


   public function assignEmployeeToPlanning(AssignEmployeeRequest $request, $planningId)
    {
        // Valider l'employee_id
        $validateData = $request->validated();

        $employeeId = $validateData['employee_id'];

        // Récupérer le planning où on veut ajouter l'employé
        $planning = Planning::findOrFail($planningId);

        // Vérifier si cet employé a déjà un planning ce jour-là
        $conflict = $this->checkConflict(
            $employeeId,
            $planning->work_date,
            $planning->start_time,
            $planning->end_time,
            $planning->id
        );

        if ($conflict) {
            return response()->json([
                'status' => 'error',
                'message' => "L'employé avec l'ID {$employeeId} est déjà assigné à un planning à ce créneau"
            ], 400);
        }


        // Associer l'employé au planning (sans supprimer les autres)
        $planning->employees()->syncWithoutDetaching([$employeeId]);
        $this->bustPlanningCaches($planning->id);
        return response()->json([
            'message' => 'Employé ajouté au planning avec succès',
            'planning' => $planning->load('employees'),
        ], 200);
    }

    //LA PARTIE MODIFICATION DE PLANNINGS 

    public function updatePlanning(UpdatePlanningRequest $request, $planningId)
    {
        // Récuperer le planning existant
        $planning = Planning::findOrFail($planningId);

        // Validation des données que l'on souhaite mettre à jour
        $validateData = $request->validated();


        //Verifier la disponibliter d'un employer 
        if(isset($validateData['employees']) && isset($validateData['work_date']) && isset($validateData['start_time']) && isset($validateData['end_time'])) {
            foreach ($validateData['employees'] as $employeeId) {
                $conflict = $this->checkConflict(
                    $employeeId,
                    $validateData['work_date'],
                    $validateData['start_time'],
                    $validateData['end_time'],
                    $planningId // important : on exclut le planning en cours
                );

                if ($conflict) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "L'employé avec l'ID {$employeeId} est déjà assigné à un planning à ce créneau"
                    ], 400);
                }

            }
        }

        //Mettre à jour le planning
        $planning->update([
            'name'         => $validateData['name'] ?? $planning->name,
            'work_date'    => $validateData['work_date'] ?? $planning->work_date,
            'start_time'   => $validateData['start_time'] ?? $planning->start_time,
            'end_time'     => $validateData['end_time'] ?? $planning->end_time,
            'notes'        => $validateData['notes'] ?? $planning->notes,
        ]);

        // Si les employés sont envoyés mettre à jour la liste
        if(isset($validateData['employees'])) {
            $planning->employees()->sync($validateData['employees']); // remplace la liste actuelle
        }

        $this->bustPlanningCaches($planning->id);
        return response()->json($planning->load('employees'), 200);

    }

    // LA PARTIE DUPLICATION DE PLANNINGS

    public function duplicatePlanning(DuplicatePlanningRequest $request, $planningId)
    {
        $validateData = $request->validated();

        // Les valeurs par défaut 
        $includeEmployees = $validateData['include_employees'] ?? true;
        $renameWithDate = $validateData['rename_with_date'] ?? false;

        // Charger le planning source avec ces employées 
        $sourcePlanning = Planning::with('employees')->findOrFail($planningId);

        // Initialisation des tableaux de resultats
        $creePlannings = [];
        $ignores = [];

        // Boucle pour chaque date cible 
        foreach($validateData['new_date'] as $targetDate) {
            //trouver si l’employé $employeeId a déjà un planning le targetDate qui se recoupe avec l’intervalle [start_time, end_time] du planning source.
            if ($includeEmployees) {
                $employeeIds = $sourcePlanning->employees->pluck('id')->all(); // Récupérer les IDs des employés du planning source
                $hasConflict = false;
                $conflictsForDate = [];

                foreach ($employeeIds as $employeeId) {
                    $conflict = $this->checkConflict(
                        $employeeId,
                        $targetDate,
                        $sourcePlanning->start_time,
                        $sourcePlanning->end_time
                    );

                    if ($conflict) {
                        $hasConflict = true;
                        $conflictsForDate[] = $employeeId;
                    }
                }


                if ($hasConflict) {
                    $ignores[] = [
                        'date' => $targetDate,
                        'raison' => 'Conflit de disponibilités',
                        'employee_en_conflit' => $conflictsForDate,
                    ];
                    continue; // Passer à la date suivante
                }
            }

            $copy = $sourcePlanning->replicate(['id']); // clone des attributs (sauf id)
            $copy->work_date  = $targetDate;
            if ($renameWithDate) {
                $copy->name = "{$sourcePlanning->name} - {$targetDate}";
            }
            $copy->push(); // sauvegarde

            // Rattache les employés au planning dupliqué via la relation employees() (pivot)
            if ($includeEmployees && $sourcePlanning->employees->isNotEmpty()) {
                $copy->employees()->attach($sourcePlanning->employees->pluck('id')->all());
            }

            $creePlannings[] = [
            'id'        => $copy->id,
            'work_date' => $copy->work_date,
            'name'      => $copy->name,
            ];

            // Invalider cache
            $this->bustPlanningCaches($copy->id);
        }

        return response()->json([
            'status'  => 'ok',
            'creePlannings' => $creePlannings,
            'ignores' => $ignores,
            'source'  => [
                'id'        => $sourcePlanning->id,
                'work_date' => $sourcePlanning->work_date,
                'name'      => $sourcePlanning->name,
            ],
        ], empty($creePlannings) ? 200 : 201);

    }

    // LA PARTIE SUPRESSION DE PLANNINGS ET SUPPRESSION DE X EMPLOYES D'UN PLANNING

    public function deletePlanning($planningId)
    {
        // Récupérer le planning, ou erreur 404 si inexistant
        $planning = Planning::findOrFail($planningId);

        // Supprimer les relations employés d'abord pour éviter les erreurs de clé étrangère
        $planning->employees()->detach();

        // Supprimer le planning
        $planning->delete();
        $this->bustPlanningCaches($planningId);

        return response()->json([
            'message' => "Planning ID {$planningId} supprimé avec succès."
        ], 200);
    }

    public function removeEmployeeFromPlanning(RemoveEmployeesRequest $request, $planningId)
    {
        // Valider les employés à retirer
        $validateData = $request->validated();

        // Récupérer le planning
        $planning = Planning::findOrFail($planningId);

        // Retirer les employés spécifiés
        $planning->employees()->detach($validateData['employees']);
        $this->bustPlanningCaches($planning->id);

        return response()->json([
            'message'  => 'Employés retirés du planning avec succès',
            'planning' => $planning->load('employees'),
        ], 200);
    }

}
