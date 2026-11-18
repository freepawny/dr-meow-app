<?php

use App\Http\Controllers\Api\CatController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // 1. Health Check
    Route::get('/health', [HealthController::class, 'index']);

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
