<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Purchase;
use App\Models\Sale;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function daily()
    {
        $start = Carbon::today()->subDays(29);
        $end = Carbon::today();

        // Get purchase totals per day
        $purchases = Purchase::whereBetween('purchase_date', [$start, $end])
            ->selectRaw('DATE(purchase_date) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Get sale totals per day
        $sales = Sale::whereBetween('sale_date', [$start, $end])
            ->selectRaw('DATE(sale_date) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dates = [];
        for ($date = $start->copy(); $date <= $end; $date->addDay()) {
            $dateStr = $date->toDateString();
            $dates[] = [
                'date'     => $dateStr,
                'purchases' => isset($purchases[$dateStr]) ? (float) $purchases[$dateStr]->total : 0,
                'sales'    => isset($sales[$dateStr]) ? (float) $sales[$dateStr]->total : 0,
            ];
        }

        return response()->json($dates);
    }

    public function monthly()
    {
        $start = Carbon::today()->subMonths(11)->startOfMonth();
        $end = Carbon::today()->endOfMonth();

        $purchases = Purchase::whereBetween('purchase_date', [$start, $end])
            ->selectRaw('YEAR(purchase_date) as year, MONTH(purchase_date) as month, SUM(total_amount) as total')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                $key = $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT);
                return [$key => $item->total];
            });

        $sales = Sale::whereBetween('sale_date', [$start, $end])
            ->selectRaw('YEAR(sale_date) as year, MONTH(sale_date) as month, SUM(total_amount) as total')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                $key = $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT);
                return [$key => $item->total];
            });

        $months = [];
        $current = $start->copy();
        while ($current <= $end) {
            $key = $current->format('Y-m');
            $months[] = [
                'month'     => $current->format('M Y'),
                'purchases' => isset($purchases[$key]) ? (float) $purchases[$key] : 0,
                'sales'     => isset($sales[$key]) ? (float) $sales[$key] : 0,
            ];
            $current->addMonth();
        }

        return response()->json($months);
    }

    public function yearly()
    {
        $startYear = Carbon::today()->subYears(4)->year;
        $currentYear = Carbon::today()->year;

        $purchases = Purchase::whereYear('purchase_date', '>=', $startYear)
            ->selectRaw('YEAR(purchase_date) as year, SUM(total_amount) as total')
            ->groupBy('year')
            ->orderBy('year')
            ->get()
            ->keyBy('year');

        $sales = Sale::whereYear('sale_date', '>=', $startYear)
            ->selectRaw('YEAR(sale_date) as year, SUM(total_amount) as total')
            ->groupBy('year')
            ->orderBy('year')
            ->get()
            ->keyBy('year');

        $years = [];
        for ($year = $startYear; $year <= $currentYear; $year++) {
            $years[] = [
                'year'      => (string) $year,
                'purchases' => isset($purchases[$year]) ? (float) $purchases[$year]->total : 0,
                'sales'     => isset($sales[$year]) ? (float) $sales[$year]->total : 0,
            ];
        }

        return response()->json($years);
    }
}
