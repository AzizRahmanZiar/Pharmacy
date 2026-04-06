<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller{

    public function index(){
    $expense = Expense::where('pharmacy_id', Auth::user()->pharmacy_id)
        ->latest()
        ->paginate(3);

    return response()->json($expense);
}

    public function store(Request $request){
        $request->validate([
        'title' => 'required|string|max:255',
        'amount' => 'required|numeric',
        'expense_date' => 'required|date',
        'note' => 'nullable|string'
    ]);


        $expense = Expense::create([
        'user_id' => Auth::id(),
        'pharmacy_id' => Auth::user()->pharmacy_id,
        'title' => $request->title,
        'amount' => $request->amount,
        'expense_date' => $request->expense_date,
        'note' => $request->note
    ]);
    ($request->all());

        return response()->json($expense);
    }


    public function update(Request $request, $id){
    $expense = Expense::where('pharmacy_id', Auth::user()->pharmacy_id)
        ->findOrFail($id);

    $request->validate([
        'title' => 'required|string|max:255',
        'amount' => 'required|numeric',
        'expense_date' => 'required|date',
        'note' => 'nullable|string'
    ]);

    $expense->update([
        'title' => $request->title,
        'amount' => $request->amount,
        'expense_date' => $request->expense_date,
        'note' => $request->note
    ]);

    return response()->json([
        'message' => 'Expense updated successfully',
        'expense' => $expense
    ]);
}


    public function destroy($id){
    $expense = Expense::where('pharmacy_id', Auth::user()->pharmacy_id)
        ->findOrFail($id);

    $expense->delete();

    return response()->json([
        'message' => 'Expense deleted successfully'
    ]);
}
}
