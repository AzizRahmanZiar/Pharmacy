<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Medicine;

class MedicineController extends Controller{

 // app/Http/Controllers/MedicineController.php

public function index(Request $request){
    $query = Medicine::where('quantity', '>', 0); // exclude zero stock

    // If you need pagination:
    $medicines = $query->latest()->paginate(10);

    return response()->json($medicines);
}
}

