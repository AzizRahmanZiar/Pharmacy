<?php
namespace App\Http\Controllers;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\PurchaseDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function daily()
{
    $userId = Auth::id();

    $start = Carbon::today()->subDays(29)->startOfDay();
    $end = Carbon::today()->endOfDay();

    // Purchases
    $purchases = Purchase::where('user_id', $userId)
        ->whereBetween('purchase_date', [$start, $end])
        ->selectRaw('DATE(purchase_date) as date, SUM(total_amount) as total')
        ->groupBy('date')
        ->get()
        ->keyBy('date');

    // Sales
    $sales = Sale::where('user_id', $userId)
        ->whereBetween('sale_date', [$start, $end])
        ->selectRaw('DATE(sale_date) as date, SUM(total_amount) as total')
        ->groupBy('date')
        ->get()
        ->keyBy('date');

    // Profit (via purchases)
    $profit = PurchaseDetail::join('purchases', 'purchases.id', '=', 'purchase_details.purchase_id')
        ->where('purchases.user_id', $userId)
        ->whereBetween('purchases.purchase_date', [$start, $end])
        ->selectRaw('DATE(purchases.purchase_date) as date, SUM(purchase_details.total_profit) as total')
        ->groupBy('date')
        ->get()
        ->keyBy('date');

    // Expenses
    $expenses = Expense::where('user_id', $userId)
    ->whereBetween('created_at', [$start, $end])
    ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
    ->groupBy('date')
    ->get()
    ->keyBy('date');

    $dates = [];
    for ($date = $start->copy(); $date <= $end; $date->addDay()) {
        $dateStr = $date->toDateString();
        $dates[] = [
            'date'      => $dateStr,
            'purchases' => $purchases[$dateStr]->total ?? 0,
            'sales'     => $sales[$dateStr]->total ?? 0,
            'profit'    => $profit[$dateStr]->total ?? 0,
            'expenses'  => $expenses[$dateStr]->total ?? 0,
        ];
    }

    return response()->json($dates);
}

    public function monthly()
{
    $userId = Auth::id();

    $start = Carbon::today()->subMonths(11)->startOfMonth();
    $end = Carbon::today()->endOfMonth();

    $formatKey = fn($y, $m) => $y . '-' . str_pad($m, 2, '0', STR_PAD_LEFT);

    $purchases = Purchase::where('user_id', $userId)
        ->whereBetween('purchase_date', [$start, $end])
        ->selectRaw('YEAR(purchase_date) y, MONTH(purchase_date) m, SUM(total_amount) total')
        ->groupBy('y', 'm')
        ->get()
        ->mapWithKeys(fn($i) => [$formatKey($i->y, $i->m) => $i->total]);

    $sales = Sale::where('user_id', $userId)
        ->whereBetween('sale_date', [$start, $end])
        ->selectRaw('YEAR(sale_date) y, MONTH(sale_date) m, SUM(total_amount) total')
        ->groupBy('y', 'm')
        ->get()
        ->mapWithKeys(fn($i) => [$formatKey($i->y, $i->m) => $i->total]);

    $profit = PurchaseDetail::join('purchases', 'purchases.id', '=', 'purchase_details.purchase_id')
        ->where('purchases.user_id', $userId)
        ->whereBetween('purchases.purchase_date', [$start, $end])
        ->selectRaw('YEAR(purchases.purchase_date) y, MONTH(purchases.purchase_date) m, SUM(purchase_details.total_profit) total')
        ->groupBy('y', 'm')
        ->get()
        ->mapWithKeys(fn($i) => [$formatKey($i->y, $i->m) => $i->total]);

    $expenses = Expense::where('user_id', $userId)
    ->whereBetween('created_at', [$start, $end])
    ->selectRaw('YEAR(created_at) y, MONTH(created_at) m, SUM(amount) total')
    ->groupBy('y', 'm')
    ->get()
    ->mapWithKeys(fn($i) => [$formatKey($i->y, $i->m) => $i->total]);

    $months = [];
    $current = $start->copy();

    while ($current <= $end) {
        $key = $current->format('Y-m');

        $months[] = [
            'month'     => $current->format('M Y'),
            'purchases' => $purchases[$key] ?? 0,
            'sales'     => $sales[$key] ?? 0,
            'profit'    => $profit[$key] ?? 0,
            'expenses'  => $expenses[$key] ?? 0,
        ];

        $current->addMonth();
    }

    return response()->json($months);
}

    public function yearly()
{
    $userId = Auth::id();

    $startYear = Carbon::today()->subYears(4)->year;
    $currentYear = Carbon::today()->year;

    $purchases = Purchase::where('user_id', $userId)
        ->whereYear('purchase_date', '>=', $startYear)
        ->selectRaw('YEAR(purchase_date) y, SUM(total_amount) total')
        ->groupBy('y')
        ->get()
        ->keyBy('y');

    $sales = Sale::where('user_id', $userId)
        ->whereYear('sale_date', '>=', $startYear)
        ->selectRaw('YEAR(sale_date) y, SUM(total_amount) total')
        ->groupBy('y')
        ->get()
        ->keyBy('y');

    $profit = PurchaseDetail::join('purchases', 'purchases.id', '=', 'purchase_details.purchase_id')
        ->where('purchases.user_id', $userId)
        ->whereYear('purchases.purchase_date', '>=', $startYear)
        ->selectRaw('YEAR(purchases.purchase_date) y, SUM(purchase_details.total_profit) total')
        ->groupBy('y')
        ->get()
        ->keyBy('y');

    $expenses = Expense::where('user_id', $userId)
    ->whereYear('created_at', '>=', $startYear)
    ->selectRaw('YEAR(created_at) y, SUM(amount) total')
    ->groupBy('y')
    ->get()
    ->keyBy('y');

    $years = [];

    for ($year = $startYear; $year <= $currentYear; $year++) {
        $years[] = [
            'year'      => (string) $year,
            'purchases' => $purchases[$year]->total ?? 0,
            'sales'     => $sales[$year]->total ?? 0,
            'profit'    => $profit[$year]->total ?? 0,
            'expenses'  => $expenses[$year]->total ?? 0,
        ];
    }

    return response()->json($years);
}
}
