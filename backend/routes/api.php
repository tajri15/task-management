<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;

// --- Rute Autentikasi (Publik) ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);


// --- Rute Terproteksi (Perlu Login/JWT) ---
Route::group(['middleware' => 'auth:api'], function () {
    
    // Rute Auth tambahan
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::apiResource('/tasks', TaskController::class);
});