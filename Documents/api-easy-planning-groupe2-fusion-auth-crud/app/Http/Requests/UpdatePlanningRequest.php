<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanningRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => 'sometimes|string|max:255',
            'work_date'   => 'sometimes|date',
            // si l'un est envoyé, l'autre doit l'être aussi
            'start_time'  => 'sometimes|date_format:H:i:s|required_with:end_time',
            'end_time'    => 'sometimes|date_format:H:i:s|required_with:start_time|after:start_time',
            'employees'   => 'sometimes|array',
            'employees.*' => 'exists:employees,id',
            'notes'       => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string'            => 'Le nom doit être une chaîne de caractères.',
            'name.max'               => 'Le nom ne doit pas dépasser 255 caractères.',
            'work_date.date'         => 'La date doit être valide (AAAA-MM-JJ).',
            'start_time.date_format' => "L'heure de début doit être au format HH:MM.",
            'start_time.required_with' => "L'heure de début est requise si l'heure de fin est fournie.",
            'end_time.date_format'   => "L'heure de fin doit être au format HH:MM.",
            'end_time.required_with' => "L'heure de fin est requise si l'heure de début est fournie.",
            'end_time.after'         => "L'heure de fin doit être après l'heure de début.",
            'employees.array'        => 'Le champ employees doit être un tableau d’IDs.',
            'employees.*.exists'     => "Un ou plusieurs employés n'existent pas.",
            'notes.string'           => 'Les notes doivent être une chaîne de caractères.',
            'notes.max'              => 'Les notes ne doivent pas dépasser 1000 caractères.',
        ];
    }
}
