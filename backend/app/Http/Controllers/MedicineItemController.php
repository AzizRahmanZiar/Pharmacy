<?php

namespace App\Http\Controllers;

use App\Models\MedicineItem;
use Illuminate\Http\Request;

class MedicineItemController extends Controller{


    public function index() {
    return response()->json(MedicineItem::paginate(4));
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'family' => 'nullable|string|max:255',
        ]);

        $item = MedicineItem::create($request->all());

        return response()->json($item, 201); // important for React
    }

    public function destroy($id){
    $item = MedicineItem::findOrFail($id);
    $item->delete();

    return response()->json(['message' => 'Deleted successfully']);
    }

    public function update(Request $request, $id){
    $item = MedicineItem::findOrFail($id);

    $item->update([
        'name' => $request->name,
        'generic_name' => $request->generic_name,
        'company' => $request->company,
        'family' => $request->family,
    ]);

    return response()->json($item);
    }


}

