<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Medicine;
use Illuminate\Support\Facades\Auth;

class MedicineController extends Controller{

 // app/Http/Controllers/MedicineController.php

public function index(Request $request){
    $query = Medicine::where('user_id', Auth::id())
        ->where('quantity', '>', 0);

    // If you need pagination:
    $medicines = $query->latest()->paginate(5);

    return response()->json($medicines);
}
}

