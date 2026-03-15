<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Medicine;
use App\Models\PurchaseDetail;

class DashboardController extends Controller
{
    public function index(){

        $totalPurchases = PurchaseDetail::sum('total_buyer_price');

        $totalProfit = PurchaseDetail::sum('total_profit');

        $totalExpenses = Expense::sum('amount');

        $netProfit = $totalProfit - $totalExpenses;

        $lowStock = Medicine::where('quantity','<',100)->get();

        return response()->json([
            'totalPurchases' => $totalPurchases,
            'totalProfit' => $totalProfit,
            'totalExpenses' => $totalExpenses,
            'netProfit' => $netProfit,
            'lowStock' => $lowStock
        ]);
    }
}
