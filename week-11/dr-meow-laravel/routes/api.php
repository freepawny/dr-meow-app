<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::prefix('v1')->group(function () {
    // 1. Health Check
    Route::get('/health', [HealthController::class, 'index']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // 2. Services Endpoints
        Route::apiResource('services', ServiceController::class);

        // 3. Customers Endpoints & Relasi Khusus
        Route::apiResource('customers', CustomerController::class);
        Route::get('/customers/{customerId}/cats', [CustomerController::class, 'cats']);
        Route::get('/customers/{customerId}/reservations', [CustomerController::class, 'reservations']);

        // 4. Cats Endpoints
        Route::apiResource('cats', CatController::class);

        // 5. Reservations Endpoints
        Route::apiResource('reservations', ReservationController::class);
    });
});
