<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

//PlanningResource va décider exactement quelles données d’un Planning tu veux envoyer au frontend, et comment elles doivent être formatées
class PlanningResource extends JsonResource
{
   public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'work_date' => $this->work_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'notes' => $this->notes,
            'employees' => $this->employees->map(function($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                ];
            }),
        ];
    }

}
