<?php

use Illuminate\Support\Facades\Route;

// Controllers
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

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (No Auth)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ Forgot / Reset Password (should NOT require auth)
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (auth:sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Medicines
    Route::get('/medicine', [MedicineController::class, 'index']);

    // Medicine Items
    Route::prefix('items')->group(function () {
        Route::get('/', [MedicineItemController::class, 'index']);
        Route::post('/', [MedicineItemController::class, 'store']);
        Route::put('/{id}', [MedicineItemController::class, 'update']);
        Route::delete('/{id}', [MedicineItemController::class, 'destroy']);
    });

    // Purchases
    Route::prefix('purchases')->group(function () {
        Route::get('/', [PurchaseController::class,'index']);
        Route::post('/', [PurchaseController::class,'store']);
        Route::get('/{id}', [PurchaseController::class,'show']);
        Route::put('/{id}', [PurchaseController::class,'update']);
        Route::delete('/{id}', [PurchaseController::class,'destroy']);
    });

    Route::get('/formData', [PurchaseController::class, 'formData']);

    // Sales
    Route::prefix('sales')->group(function () {
        Route::get('/', [SaleController::class,'index']);
        Route::get('/{id}', [SaleController::class,'show']);
        Route::post('/', [SaleController::class,'store']);
        Route::put('/{id}', [SaleController::class,'update']);
        Route::delete('/{id}', [SaleController::class,'destroy']);
    });

    Route::get('/medicines', [SaleController::class, 'formData']);

    // Expenses
    Route::prefix('expenses')->group(function () {
        Route::get('/', [ExpenseController::class,'index']);
        Route::post('/', [ExpenseController::class,'store']);
        Route::put('/{id}', [ExpenseController::class,'update']);
        Route::delete('/{id}', [ExpenseController::class,'destroy']);
    });

    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('/daily', [ReportController::class, 'daily']);
        Route::get('/weekly', [ReportController::class, 'weekly']);
        Route::get('/monthly', [ReportController::class, 'monthly']);
        Route::get('/yearly', [ReportController::class, 'yearly']);
    });

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);

    // Doctors (API Resource)
    Route::apiResource('doctors', DoctorController::class);

});


/*
|--------------------------------------------------------------------------
| REPORT TABLES (Optional: keep public or protect)
|--------------------------------------------------------------------------
*/

// ⚠️ Decide: if sensitive → move inside auth group
Route::get('/purchase/report/table', [PurchaseController::class, 'purchaseTableReport']);
Route::get('/sale/report/table', [SaleController::class, 'saleTableReport']);

// use App\Http\Controllers\DashboardController;
// use App\Http\Controllers\ExpenseController;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\MedicineController;
// use App\Http\Controllers\MedicineItemController;
// use App\Http\Controllers\PurchaseController;
// use App\Http\Controllers\ReportController;
// use App\Http\Controllers\SaleController;
// use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\DoctorController;
// use App\Http\Controllers\TransactionController;

// Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);

// Route::middleware('auth:sanctum')->get('/medicine', [MedicineController::class, 'index']);

// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/items', [MedicineItemController::class, 'store']);
//     Route::get('/items', [MedicineItemController::class, 'index']);
//     Route::put('/items/{id}', [MedicineItemController::class, 'update']);
//     Route::delete('/items/{id}', [MedicineItemController::class, 'destroy']);
// });

// Route::middleware('auth:sanctum')->prefix('purchases')->group(function () {
//     Route::get('/', [PurchaseController::class,'index']);
//     Route::post('/', [PurchaseController::class,'store']);
//     Route::get('/{id}', [PurchaseController::class,'show']);
//     Route::put('/{id}', [PurchaseController::class,'update']);
//     Route::delete('/{id}', [PurchaseController::class,'destroy']);
// });
// Route::middleware('auth:sanctum')->get('/formData', [PurchaseController::class, 'formData']);

// Route::middleware('auth:sanctum')->prefix('sales')->group(function () {
//     Route::get('/', [SaleController::class,'index']);
//     Route::get('/{id}', [SaleController::class,'show']);
//     Route::post('/', [SaleController::class,'store']);
//     Route::put('/{id}', [SaleController::class,'update']);
//     Route::delete('/{id}', [SaleController::class,'destroy']);
// });

// Route::middleware('auth:sanctum')->get('/medicines', [SaleController::class, 'formData']);


// Route::middleware('auth:sanctum')->prefix('expenses')->group(function () {
//     Route::get('/',[ExpenseController::class,'index']);
//     Route::post('/',[ExpenseController::class,'store']);
//     Route::put('/{id}',[ExpenseController::class,'update']);
//     Route::delete('/{id}',[ExpenseController::class,'destroy']);
// });

// Route::middleware('auth:sanctum')->prefix('reports')->group(function () {
//     Route::get('/daily', [ReportController::class, 'daily']);
//     Route::get('/weekly', [ReportController::class, 'weekly']);
//     Route::get('/monthly', [ReportController::class, 'monthly']);
//     Route::get('/yearly', [ReportController::class, 'yearly']);
// });

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/logout', [AuthController::class, 'logout']);

//     Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
// });


// Route::middleware('auth:sanctum')->get('/transactions', [TransactionController::class, 'index']);


// Route::get('/purchase/report/table', [PurchaseController::class, 'purchaseTableReport']);
// Route::get('/sale/report/table', [SaleController::class, 'saleTableReport']);

// Route::apiResource('doctors', DoctorController::class)->middleware('auth:sanctum');
// Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
// Route::post('/reset-password', [AuthController::class, 'resetPassword']);
