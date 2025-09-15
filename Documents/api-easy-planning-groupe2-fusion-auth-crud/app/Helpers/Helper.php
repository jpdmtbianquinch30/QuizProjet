<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Cache;
use App\Models\Planning;
use Carbon\Carbon;

trait Helper
{
    private function bustPlanningCaches($planningId = null): void
    {
        Cache::forget('employees.index');
        Cache::forget('plannings.index');
        if ($planningId !== null) {
            Cache::forget("planning.$planningId");
        }
    }

    // Gestion des conflits de planning pour les heures 
    private function checkConflict($employeeId, $workDate, $start, $end, $excludePlanningId = null): bool
    {
        // Construire l’intervalle absolu du nouveau shift
        $newStart = Carbon::parse("$workDate $start"); // Objet datetime
        $newEnd   = Carbon::parse("$workDate $end");
        if ($newEnd->lte($newStart)) {
            // traverse minuit -> fin = +1 jour
            $newEnd->addDay();
        }

        // On regarde les plannings de J-1, J, J+1 pour cet employé
        $day     = Carbon::parse($workDate);
        $dates   = [$day->copy()->subDay()->toDateString(), $day->toDateString(), $day->copy()->addDay()->toDateString()];

        $plannings = Planning::whereHas('employees', function ($q) use ($employeeId) {
                $q->where('employees.id', $employeeId);
            })
            ->when($excludePlanningId, function ($q) use ($excludePlanningId) {
                $q->where('id', '!=', $excludePlanningId);
            })
            ->whereIn('work_date', $dates)
            ->get(['id','work_date','start_time','end_time']); // On rapatrie le minimum

        // Comparer chaque planning avec notre intervalle absolu
        foreach ($plannings as $p) {
            $pStart = Carbon::parse("{$p->work_date} {$p->start_time}");
            $pEnd   = Carbon::parse("{$p->work_date} {$p->end_time}");
            if ($pEnd->lte($pStart)) {
                // ce planning traverse aussi minuit
                $pEnd->addDay();
            }

            // Chevauchement sur [start, end) : intersection non vide
            if ($newStart->lt($pEnd) && $newEnd->gt($pStart)) {
                return true; // conflit détecté
            }
        }

        return false; // aucun chevauchement
    }
}
