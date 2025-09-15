<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignEmployeeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => "L'identifiant de l'employé est obligatoire.",
            'employee_id.exists'   => "L'employé spécifié est introuvable.",
        ];
    }
}
