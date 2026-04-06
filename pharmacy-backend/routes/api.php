<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MedicineItemController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PharmacyController;
use App\Http\Controllers\StaffPermissionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/medicine', [MedicineController::class, 'index']);

    Route::prefix('items')->group(function () {
        Route::get('/', [MedicineItemController::class, 'index']);
        Route::post('/', [MedicineItemController::class, 'store']);
        Route::put('/{id}', [MedicineItemController::class, 'update']);
        Route::delete('/{id}', [MedicineItemController::class, 'destroy']);
    });

    Route::prefix('purchases')->group(function () {
        Route::get('/', [PurchaseController::class,'index']);
        Route::post('/', [PurchaseController::class,'store']);
        Route::get('/{id}', [PurchaseController::class,'show']);
        Route::put('/{id}', [PurchaseController::class,'update']);
        Route::delete('/{id}', [PurchaseController::class,'destroy']);
    });

    Route::get('/formData', [PurchaseController::class, 'formData']);

    Route::prefix('sales')->group(function () {
        Route::get('/', [SaleController::class,'index']);
        Route::get('/{id}', [SaleController::class,'show']);
        Route::post('/', [SaleController::class,'store']);
        Route::put('/{id}', [SaleController::class,'update']);
        Route::delete('/{id}', [SaleController::class,'destroy']);
    });

    Route::get('/medicines', [SaleController::class, 'formData']);

    Route::prefix('expenses')->group(function () {
        Route::get('/', [ExpenseController::class,'index']);
        Route::post('/', [ExpenseController::class,'store']);
        Route::put('/{id}', [ExpenseController::class,'update']);
        Route::delete('/{id}', [ExpenseController::class,'destroy']);
    });

    Route::prefix('reports')->group(function () {
        Route::get('/daily', [ReportController::class, 'daily']);
        Route::get('/weekly', [ReportController::class, 'weekly']);
        Route::get('/monthly', [ReportController::class, 'monthly']);
        Route::get('/yearly', [ReportController::class, 'yearly']);
    });

    Route::get('/transactions', [TransactionController::class, 'index']);

    Route::apiResource('doctors', DoctorController::class);

});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pharmacies', [PharmacyController::class, 'index']);
    Route::put('/pharmacies/{id}', [PharmacyController::class, 'update']);
    Route::delete('/pharmacies/{id}', [PharmacyController::class, 'destroy']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/staff-permissions', [StaffPermissionController::class, 'index']);
    Route::post('/staff-permissions', [StaffPermissionController::class, 'store']);
});
