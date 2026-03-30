<?php

namespace App\Http\Controllers;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Expense;
use App\Models\Medicine;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{

   public function index()
{
    $userId = Auth::id();

    $sales = Sale::where('user_id', $userId)->latest()->get()->map(function ($sale) {
        return [
            'type' => 'sale',
            'id' => $sale->id,
            'amount' => $sale->total_amount ?? 0,
            'description' => 'Sale Bill: ' . $sale->bill_no,
            'date' => $sale->sale_date ?? $sale->created_at,
        ];
    });

    $purchases = Purchase::where('user_id', $userId)
        ->with('Details')
        ->latest()
        ->get()
        ->map(function ($purchase) {
            return [
                'type' => 'purchase',
                'id' => $purchase->id,
                'amount' => $purchase->Details->sum('total_buyer_price'),
                'description' => 'Purchase #' . $purchase->id,
                'date' => $purchase->created_at,
            ];
        });

    $expenses = Expense::where('user_id', $userId)->latest()->get()->map(function ($expense) {
        return [
            'type' => 'expense',
            'id' => $expense->id,
            'amount' => $expense->amount ?? 0,
            'description' => 'Expense: ' . ($expense->note ?? $expense->title),
            'date' => $expense->expense_date ?? $expense->created_at,
        ];
    });

    $transactions = collect()
        ->merge($sales)
        ->merge($purchases)
        ->merge($expenses)
        ->sortByDesc('date')
        ->values();

    return response()->json($transactions);
}

}
