<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordController;

/*
| Les routes dans api.php sont automatiquement préfixées par /api
| Ex: Route::get('ping') => /api/ping
*/

// ---------- DEMO / TEST ----------
Route::middleware('api')->group(function () {
    Route::get('/employees', [TestController::class, 'getEmployees']);
    Route::get('/plannings', [TestController::class, 'getPlannings']);
    Route::get('/plannings/{planningId}', [TestController::class, 'getPlanning']);
    Route::post('/employees', [TestController::class, 'createEmployee']);
    Route::post('/plannings', [TestController::class, 'createPlanning']);
    Route::post('/plannings/{planningId}/assigne', [TestController::class, 'assignEmployeeToPlanning']);
    Route::put('/plannings/{planningId}', [TestController::class, 'updatePlanning']);
    Route::delete('/plannings/{planningId}', [TestController::class, 'deletePlanning']);
    Route::delete('/plannings/{planningId}/employees', [TestController::class, 'removeEmployeeFromPlanning']);
    Route::post('/plannings/{planningId}/duplicate', [TestController::class, 'duplicatePlanning']);
});

// ---------- AUTH PUBLIQUE ----------
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// ---------- AUTH PROTÉGÉE ----------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me',     [AuthController::class, 'me']);
    Route::post('auth/logout',[AuthController::class, 'logout']);

    // Facultatif : exemples de routes protégées par rôle (si tu as un middleware role:*)
    Route::middleware('role:ADMIN')->group(function () {
        Route::get('admin/only', fn () => response()->json(['ok' => true]));
    });
    Route::middleware('role:MANAGER')->group(function () {
        Route::get('manager/only', fn () => response()->json(['ok' => true]));
    });
});

// ---------- PASSWORD RESET (PUBLIC) ----------
Route::prefix('password')->group(function () {
    Route::post('forgot', [PasswordController::class, 'forgot'])->name('password.email');
    Route::post('reset',  [PasswordController::class, 'reset'])->name('password.reset');
});

// ---------- HEALTH ----------
Route::get('ping', fn () => response()->json(['ok' => true]));
