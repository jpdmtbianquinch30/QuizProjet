<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'   => "Le nom de l'employé est obligatoire.",
            'name.string'     => "Le nom doit être une chaîne de caractères.",
            'name.max'        => "Le nom ne doit pas dépasser 255 caractères.",
            'email.required'  => "L'email est obligatoire.",
            'email.email'     => "Le format de l'email est invalide.",
            'email.unique'    => "Cet email existe déjà.",
        ];
    }
}
