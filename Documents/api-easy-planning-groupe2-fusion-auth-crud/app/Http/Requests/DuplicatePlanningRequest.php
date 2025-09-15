<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DuplicatePlanningRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'new_date' => 'required|array|min:1', // Le tableau doit contenir min 1 date
            'new_date.*' => 'required|date', // Chaque élément du tableau doit être une date valide format AAAA-MM-JJ accepté
            'include_employees' => 'sometimes|boolean', // défaut: true (optionnel)
            'rename_with_date'   => 'sometimes|boolean', // défaut: false (optionnel)
        ];
    }

     public function messages(): array
    {
        return [
            'new_date.required'   => 'Vous devez fournir au moins une date cible.',
            'new_date.array'      => 'Le champ new_date doit être un tableau de dates.',
            'new_date.*.date'     => 'Chaque date cible doit être une date valide (AAAA-MM-JJ).',
        ];
    }
}
