<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanningRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'work_date'   => 'required|date',
            'start_time'  => 'required|date_format:H:i:s',
            'end_time'    => 'required|date_format:H:i:s|after:start_time',
            'employees'   => 'required|array',
            'employees.*' => 'exists:employees,id',
            'notes'       => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'        => 'Le nom du planning est obligatoire.',
            'name.string'          => 'Le nom doit être une chaîne de caractères.',
            'name.max'             => 'Le nom ne doit pas dépasser 255 caractères.',
            'work_date.required'   => 'La date est obligatoire.',
            'work_date.date'       => 'La date doit être valide (AAAA-MM-JJ).',
            'start_time.required'  => "L'heure de début est obligatoire.",
            'start_time.date_format' => "L'heure de début doit être au format HH:MM.",
            'end_time.required'    => "L'heure de fin est obligatoire.",
            'end_time.date_format' => "L'heure de fin doit être au format HH:MM.",
            'end_time.after'       => "L'heure de fin doit être après l'heure de début.",
            'employees.required'   => 'Vous devez assigner au moins un employé.',
            'employees.array'      => 'Le champ employees doit être un tableau d’IDs.',
            'employees.*.exists'   => "Un ou plusieurs employés n'existent pas.",
            'notes.string'         => 'Les notes doivent être une chaîne de caractères.',
            'notes.max'            => 'Les notes ne doivent pas dépasser 1000 caractères.',
        ];
    }
}
