<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Medicine;
use Illuminate\Support\Facades\Auth;

class MedicineController extends Controller{

    public function index(Request $request){
        $query = Medicine::where('pharmacy_id', Auth::user()->pharmacy_id)
            ->where('quantity', '>', 0);
            
        $medicines = $query->latest()->paginate(4);

        return response()->json($medicines);
    }
}

