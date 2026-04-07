<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Medicine;
use Illuminate\Support\Facades\Auth;

class MedicineController extends Controller{

    public function index(Request $request)
{
    $perPage = $request->get('per_page', 10); // allow frontend to control

    $medicines = Medicine::where('pharmacy_id', Auth::user()->pharmacy_id)
        ->where('quantity', '>', 0)
        ->with('supplier:id,name')  // must have relationship defined
        ->latest()
        ->paginate($perPage);

    return response()->json($medicines);
}
}
