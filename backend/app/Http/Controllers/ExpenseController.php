<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        $expese=Expense::latest()->paginate(4);

        return response()->json($expese);


    }

    public function store(Request $request)
    {
        $expense = Expense::create($request->all());

        return response()->json($expense);
    }


    public function update(Request $request, $id)
{
    $expense = Expense::findOrFail($id);

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


    public function destroy($id)
{
    $expense = Expense::findOrFail($id);

    $expense->delete();

    return response()->json([
        'message' => 'Expense deleted successfully'
    ]);
}
}
