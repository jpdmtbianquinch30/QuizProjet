<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $r) {
        $data = $r->validate([
            'name' => ['required','string','max:255'],
            'email'=> ['required','email','max:255','unique:users,email'],
            'password' => ['required', Password::min(8)],
            'role' => ['nullable','in:ADMIN,MANAGER,EMPLOYE,RH'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email'=> $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? 'EMPLOYE',
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => [
                'id'=>$user->id,'name'=>$user->name,'email'=>$user->email,'role'=>$user->role
            ],
            'token'=> $token
        ], 201);
    }

    public function login(Request $r) {
        $data = $r->validate([
            'email'=>['required','email'],
            'password'=>['required'],
        ]);

        $user = User::where('email',$data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message'=>'Identifiants invalides'], 422);
        }

        // Option: single-session
        // $user->tokens()->delete();

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => [
                'id'=>$user->id,'name'=>$user->name,'email'=>$user->email,'role'=>$user->role
            ],
            'token'=> $token
        ]);
    }

    public function me(Request $r) {
        return response()->json($r->user());
    }

    public function logout(Request $r) {
        $r->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Déconnecté']);
    }
}
