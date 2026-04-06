<?php

namespace App\Http\Controllers;

use App\Models\Pharmacy;
use Illuminate\Http\Request;

class PharmacyController extends Controller{

    public function index(Request $request){
        $perPage = min($request->get('per_page', 3), 50);

        $pharmacies = Pharmacy::with('users')
            ->paginate($perPage);

        return response()->json($pharmacies);
    }

    public function update(Request $request, $id){
        $pharmacy = Pharmacy::find($id);

        if (!$pharmacy) {
            return response()->json(['message' => 'Pharmacy not found'], 404);
        }

        $request->validate([
            'status' => 'sometimes|in:active,blocked',
        ]);

        $pharmacy->update($request->only(['status']));

        return response()->json([
            'data' => $pharmacy
        ]);
    }

    public function destroy($id){
        $pharmacy = Pharmacy::find($id);

        if (!$pharmacy) {
            return response()->json(['message' => 'Pharmacy not found'], 404);
        }

        $pharmacy->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }
}
