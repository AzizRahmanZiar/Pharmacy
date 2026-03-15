<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;

class MedicineController extends Controller{

        public function index(){
        // Get all medicines
        $medicines =Medicine::paginate(6);

        // Return as JSON
        return response()->json($medicines);
    }
}
