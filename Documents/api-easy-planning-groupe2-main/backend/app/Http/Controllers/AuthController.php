<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    //
    public function register(Request $request) {
        $data = $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255','unique:users,email'],
            'password' => ['required','string','min:8'],
            'role'     => ['nullable', Rule::in(['ADMIN','MANAGER','EMPLOYE'])],
        ]);

        // Par défaut, on protège le rôle => seuls ADMIN peuvent créer ADMIN/MANAGER (optionnel)
        $role = $data['role'] ?? 'EMPLOYE';
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            $role = 'EMPLOYE';
        }

        $user = User::create([
            'name' => $data['name'],
            'email'=> $data['email'],
            'password'=> $data['password'],
            'role'=> $role,
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user,
            'token'=> $token
        ], 201);
    }

    // POST /api/auth/login
    public function login(Request $request) {
        $credentials = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required','string'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message'=>'Identifiants invalides'], 401);
        }

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // GET /api/auth/me
    public function me(Request $request) {
        return $request->user();
    }

    // POST /api/auth/logout
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }
}
