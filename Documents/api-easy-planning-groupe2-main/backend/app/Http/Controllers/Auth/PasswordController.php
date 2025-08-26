<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    public function sendResetLink(Request $r) {
        $r->validate(['email'=>['required','email']]);
        $status = Password::sendResetLink($r->only('email'));
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message'=>'Email de réinitialisation envoyé'])
            : response()->json(['message'=>'Impossible d\'envoyer l\'email'], 422);
    }

    public function reset(Request $r) {
        $r->validate([
            'token'=>['required'],
            'email'=>['required','email'],
            'password'=>['required','confirmed','min:8'],
        ]);

        $status = Password::reset(
            $r->only('email','password','password_confirmation','token'),
            function ($user, $password) {
                $user->forceFill(['password'=>Hash::make($password)])->save();
                $user->tokens()->delete();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message'=>'Mot de passe réinitialisé'])
            : response()->json(['message'=>'Token invalide ou expiré'], 422);
    }
}
