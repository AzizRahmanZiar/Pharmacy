<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Expense;
use App\Models\Medicine;
use App\Models\PurchaseDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller{

    public function index(){
        $user = Auth::user();
        if (!$user || !$user->pharmacy_id) {
            return response()->json(['error' => 'Unauthorized or missing pharmacy'], 401);
        }

        $pharmacyId = $user->pharmacy_id;

        // Purchases – filter by pharmacy_id via the purchase relation
        $totalPurchases = PurchaseDetail::whereHas('purchase', function ($q) use ($pharmacyId) {
            $q->where('pharmacy_id', $pharmacyId);
        })->sum('total_buyer_price');

        $totalProfit = PurchaseDetail::whereHas('purchase', function ($q) use ($pharmacyId) {
            $q->where('pharmacy_id', $pharmacyId);
        })->sum('total_profit');

        // Expenses – directly filter by pharmacy_id
        $totalExpenses = Expense::where('pharmacy_id', $pharmacyId)->sum('amount');

        $netProfit = $totalProfit - $totalExpenses;

        // Medicines
        $lowStock = Medicine::where('pharmacy_id', $pharmacyId)
            ->where('quantity', '>', 0)
            ->where('quantity', '<', 100)
            ->get();

        // Near expiry
        $nearExpiry = Medicine::where('pharmacy_id', $pharmacyId)
            ->whereNotNull('expiry_date')
            ->where('quantity', '>', 0)
            ->whereBetween('expiry_date', [
                Carbon::today(),
                Carbon::today()->addDays(45)
            ])
            ->orderBy('expiry_date')
            ->get(['id', 'generic', 'expiry_date', 'quantity as stock_quantity']);

        // Doctor totals
        $totalConsultationFees = Doctor::where('pharmacy_id', $pharmacyId)->sum('fees');
        $totalSonographyFees   = Doctor::where('pharmacy_id', $pharmacyId)->sum('sonography_fee');
        $totalEcgFees          = Doctor::where('pharmacy_id', $pharmacyId)->sum('ecg_fee');
        $totalXrayFees         = Doctor::where('pharmacy_id', $pharmacyId)->sum('xray_fee');

        $totalDoctorIncome = $totalConsultationFees + $totalSonographyFees + $totalEcgFees + $totalXrayFees;

        return response()->json([
            'totalPurchases'        => $totalPurchases,
            'totalProfit'           => $totalProfit,
            'totalExpenses'         => $totalExpenses,
            'netProfit'             => $netProfit,
            'lowStock'              => $lowStock,
            'nearExpiry'            => $nearExpiry,
            'totalConsultationFees' => $totalConsultationFees,
            'totalSonographyFees'   => $totalSonographyFees,
            'totalEcgFees'          => $totalEcgFees,
            'totalXrayFees'         => $totalXrayFees,
            'totalDoctorIncome'     => $totalDoctorIncome,
        ]);
    }
}
