<?php

namespace App\Http\Controllers;

use App\Models\MedicineItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MedicineItemController extends Controller{


    public function index() {
    return response()->json(MedicineItem::where('user_id', Auth::id())->paginate(4));
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'family' => 'nullable|string|max:255',
        ]);

        $item = MedicineItem::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'generic_name' => $request->generic_name,
            'company' => $request->company,
            'family' => $request->family,
        ]);

        return response()->json($item, 201);
    }

    public function destroy($id){
    $item = MedicineItem::where('user_id', Auth::id())->findOrFail($id);

    $item->delete();

    return response()->json(['message' => 'Deleted successfully']);
    }

    public function update(Request $request, $id){
    $item = MedicineItem::where('user_id', Auth::id())->findOrFail($id);

    $item->update([
        'name' => $request->name,
        'generic_name' => $request->generic_name,
        'company' => $request->company,
        'family' => $request->family,
    ]);

    return response()->json($item);
    }


}

