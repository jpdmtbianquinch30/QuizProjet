<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RemoveEmployeesRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'employees'   => 'required|array',
            'employees.*' => 'exists:employees,id',
        ];
    }

    public function messages(): array
    {
        return [
            'employees.required'   => 'Vous devez fournir au moins un employé à retirer.',
            'employees.array'      => 'Le champ employees doit être un tableau d’IDs.',
            'employees.*.exists'   => "Un ou plusieurs employés n'existent pas.",
        ];
    }
}
