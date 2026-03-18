<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Medicine;
use App\Models\PurchaseDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Purchases (via purchase table)
        $totalPurchases = PurchaseDetail::whereHas('purchase', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->sum('total_buyer_price');

        $totalProfit = PurchaseDetail::whereHas('purchase', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->sum('total_profit');

        // Expenses (direct)
        $totalExpenses = Expense::where('user_id', $userId)
            ->sum('amount');

        $netProfit = $totalProfit - $totalExpenses;

        // Medicines (direct)
        $lowStock = Medicine::where('user_id', $userId)
            ->where('quantity', '>', 0)
            ->where('quantity', '<', 100)
            ->get();

        // Near expiry
        $nearExpiry = Medicine::where('user_id', $userId)
            ->whereNotNull('expiry_date')
            ->where('quantity', '>', 0)
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
