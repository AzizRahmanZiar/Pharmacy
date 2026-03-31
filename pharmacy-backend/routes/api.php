<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MedicineItemController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\TransactionController;

Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);

Route::middleware('auth:sanctum')->get('/medicine', [MedicineController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/items', [MedicineItemController::class, 'store']);
    Route::get('/items', [MedicineItemController::class, 'index']);
    Route::put('/items/{id}', [MedicineItemController::class, 'update']);
    Route::delete('/items/{id}', [MedicineItemController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('purchases')->group(function () {
    Route::get('/', [PurchaseController::class,'index']);
    Route::post('/', [PurchaseController::class,'store']);
    Route::get('/{id}', [PurchaseController::class,'show']);
    Route::put('/{id}', [PurchaseController::class,'update']);
    Route::delete('/{id}', [PurchaseController::class,'destroy']);
});
Route::middleware('auth:sanctum')->get('/formData', [PurchaseController::class, 'formData']);

Route::middleware('auth:sanctum')->prefix('sales')->group(function () {
    Route::get('/', [SaleController::class,'index']);
    Route::get('/{id}', [SaleController::class,'show']);
    Route::post('/', [SaleController::class,'store']);
    Route::put('/{id}', [SaleController::class,'update']);
    Route::delete('/{id}', [SaleController::class,'destroy']);
});

Route::middleware('auth:sanctum')->get('/medicines', [SaleController::class, 'formData']);


Route::middleware('auth:sanctum')->prefix('expenses')->group(function () {
    Route::get('/',[ExpenseController::class,'index']);
    Route::post('/',[ExpenseController::class,'store']);
    Route::put('/{id}',[ExpenseController::class,'update']);
    Route::delete('/{id}',[ExpenseController::class,'destroy']);
});




// Route::middleware('auth:sanctum')->get('/reports/daily', [ReportController::class, 'daily']);
// Route::middleware('auth:sanctum')->get('/reports/monthly', [ReportController::class, 'monthly']);
// Route::middleware('auth:sanctum')->get('/reports/yearly', [ReportController::class, 'yearly']);

Route::middleware('auth:sanctum')->prefix('reports')->group(function () {
    Route::get('/daily', [ReportController::class, 'daily']);
    Route::get('/weekly', [ReportController::class, 'weekly']);
    Route::get('/monthly', [ReportController::class, 'monthly']);
    Route::get('/yearly', [ReportController::class, 'yearly']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
});


Route::middleware('auth:sanctum')->get('/transactions', [TransactionController::class, 'index']);
