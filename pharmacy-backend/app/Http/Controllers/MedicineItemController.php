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
            'g_name' => 'required|string|max:255',
            'b_name' => 'required|string|max:255',
            'd_form' => 'required|string|max:255',
            'strength' => 'required|string|max:255',
             'route' => 'required|string|max:255',
        ]);

        $item = MedicineItem::create([
            'user_id' => Auth::id(),
            'g_name' => $request->g_name,
            'b_name' => $request->b_name,
            'd_form' => $request->d_form,
            'strength' => $request->strength,
            'route' => $request->route,
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
        'g_name' => $request->g_name,
        'b_name' => $request->b_name,
        'd_form' => $request->d_form,
        'strength' => $request->strength,
        'route' => $request->route,
    ]);

    return response()->json($item);
    }


}

