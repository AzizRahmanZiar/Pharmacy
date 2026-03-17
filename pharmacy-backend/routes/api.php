<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MedicineItemController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;


Route::get('/dashboard', [DashboardController::class, 'index']);

Route::get('/medicine', [MedicineController::class, 'index']);

Route::get('/items', [MedicineItemController::class, 'index']);
Route::post('/items', [MedicineItemController::class, 'store']);
Route::put('/items/{id}', [MedicineItemController::class, 'update']);
Route::delete('/items/{id}', [MedicineItemController::class, 'destroy']);

Route::apiResource('purchases', PurchaseController::class);

Route::put('/purchases/{id}',[PurchaseController::class,'update']);


Route::get('/purchases',[PurchaseController::class,'index']);
Route::get('/purchases/{id}',[PurchaseController::class,'show']);
Route::get('/purchase-form-data', [PurchaseController::class, 'formData']);
Route::post('/purchases',[PurchaseController::class,'store']);
Route::put('/purchases/{id}',[PurchaseController::class,'update']);
Route::delete('/purchases/{id}', [PurchaseController::class, 'destroy']);


Route::get('/medicines', [SaleController::class, 'formData']);
Route::get('/sales', [SaleController::class,'index']);
Route::get('/sales/{id}', [SaleController::class,'show']);
Route::post('/sales', [SaleController::class,'store']);
Route::put('/sales/{id}', [SaleController::class,'update']);
Route::delete('/sales/{id}', [SaleController::class,'destroy']);


Route::get('/expenses',[ExpenseController::class,'index']);
Route::post('/expenses',[ExpenseController::class,'store']);
Route::put('/expenses/{id}',[ExpenseController::class,'update']);
Route::delete('/expenses/{id}',[ExpenseController::class,'destroy']);




Route::get('/reports/daily', [ReportController::class, 'daily']);
Route::get('/reports/monthly', [ReportController::class, 'monthly']);
Route::get('/reports/yearly', [ReportController::class, 'yearly']);
