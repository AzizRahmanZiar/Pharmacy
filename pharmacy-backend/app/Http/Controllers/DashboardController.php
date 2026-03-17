<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Medicine;
use App\Models\PurchaseDetail;
use Carbon\Carbon; // <-- Add this for date handling

class DashboardController extends Controller
{
    public function index()
{
    // Existing metrics
    $totalPurchases = PurchaseDetail::sum('total_buyer_price');
    $totalProfit = PurchaseDetail::sum('total_profit');
    $totalExpenses = Expense::sum('amount');
    $netProfit = $totalProfit - $totalExpenses;

    // Low stock medicines (quantity < 100 AND quantity > 0)
    $lowStock = Medicine::where('quantity', '>', 0)
        ->where('quantity', '<', 100)
        ->get();

    // Near expiry medicines (expiring within the next 45 days)
    $nearExpiry = Medicine::whereNotNull('expiry_date')
        ->where('quantity', '>', 0) // optional: also hide zero‑stock here
        ->whereBetween('expiry_date', [
            Carbon::today(),
            Carbon::today()->addDays(45)
        ])
        ->orderBy('expiry_date')
        ->get(['id', 'name', 'expiry_date', 'quantity as stock_quantity']);

    return response()->json([
        'totalPurchases' => $totalPurchases,
        'totalProfit'    => $totalProfit,
        'totalExpenses'  => $totalExpenses,
        'netProfit'      => $netProfit,
        'lowStock'       => $lowStock,
        'nearExpiry'     => $nearExpiry,
    ]);
}
}
