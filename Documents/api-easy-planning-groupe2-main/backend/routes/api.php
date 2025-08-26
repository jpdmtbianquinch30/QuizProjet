<?php

use Illuminate\Support\Facades\Route;

// ⬇️ SI tes contrôleurs sont dans app/Http/Controllers/Auth/...
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordController;

// ⬇️ SINON (si tes fichiers sont directement dans app/Http/Controllers/),
// remplace les 2 lignes ci-dessus par :
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\PasswordController;

// ---------- AUTH PUBLIQUE ----------
Route::prefix('auth')->group(function () {
    // POST /api/auth/register
    Route::post('register', [AuthController::class, 'register']);

    // POST /api/auth/login
    Route::post('login', [AuthController::class, 'login']);
});

// ---------- AUTH PROTÉGÉE ----------
Route::middleware('auth:sanctum')->group(function () {
    // GET  /api/auth/me
    Route::get('auth/me', [AuthController::class, 'me']);

    // POST /api/auth/logout
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // --- Exemples de routes par rôle (sans slash au début) ---
    Route::middleware('role:ADMIN')->group(function () {
        Route::get('admin/only', fn () => response()->json(['ok' => true]));
    });

    Route::middleware('role:MANAGER')->group(function () {
        Route::get('manager/only', fn () => response()->json(['ok' => true]));
    });
});

// ---------- PASSWORD RESET (public) ----------
Route::prefix('password')->group(function () {
    // POST /api/password/forgot
    Route::post('forgot', [PasswordController::class, 'forgot']);

    // POST /api/password/reset
    Route::post('reset', [PasswordController::class, 'reset']);
});

// ---------- HEALTH ----------
Route::get('ping', fn () => response()->json(['ok' => true]));
