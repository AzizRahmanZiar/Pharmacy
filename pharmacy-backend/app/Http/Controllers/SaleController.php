<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Medicine;
use Illuminate\Support\Facades\Auth;

class SaleController extends Controller{
public function index(Request $request)
{
    $query = Sale::where('user_id', Auth::id())->latest();

    if ($request->has('status') && $request->status !== 'all') {
        $query->where('payment_status', $request->status);
    }

    $sales = $query->paginate(3);

    return response()->json($sales);
}

public function show($id)
{
    $sale = Sale::where('user_id', Auth::id())
    ->with('details.medicine')
    ->findOrFail($id);
    // Add original_quantity to each medicine
    $sale->details->each(function ($detail) {
        $detail->medicine->original_quantity = $detail->medicine->quantity + $detail->quantity;
    });
    return response()->json($sale);
}

    // public function show($id){
    //     $sale = Sale::with('details.medicine')->find($id);
    //     return response()->json($sale);
    // }

    public function formData(){
        return response()->json(Medicine::all());
    }

    public function store(Request $request){

        $request->validate([
            'bill_no' => 'required|string',
            'patient_name' => 'nullable|string',
            'sale_date' => 'required|date',
            'paid_amount' => 'nullable|numeric|min:0',
            'medicines' => 'required|array'
        ]);

        $totalAmount = 0;

        foreach ($request->medicines as $row) {

            if (!$row['medicine_id'] || $row['quantity'] <= 0) {
                continue;
            }

            $medicine = Medicine::find($row['medicine_id']);

            if (!$medicine) {
                return response()->json([
                    'error'=>'Medicine does not exist'
                ],400);
            }

            if ($medicine->quantity == 0) {
                return response()->json([
                    'error'=>'Medicine '.$medicine->name.' out of stock'
                ],400);
            }

            if ($row['quantity'] > $medicine->quantity) {
                return response()->json([
                    'error'=>'Not enough stock for '.$medicine->name
                ],400);
            }

            // calculate total
            $totalAmount += $row['quantity'] * $medicine->sale_price;
        }

        $paidAmount = $request->paid_amount ?? 0;
        $dueAmount = $totalAmount - $paidAmount;

        $status = 'pending';

        if($paidAmount == 0){
            $status = 'pending';
        }
        elseif($paidAmount < $totalAmount){
            $status = 'partial';
        }
        else{
            $status = 'paid';
        }

        $sale = Sale::create([
            'user_id' => Auth::id(),
            'bill_no'=>$request->bill_no,
            'patient_name'=>$request->patient_name,
            'sale_date'=>$request->sale_date,
            'total_amount'=>$totalAmount,
            'paid_amount'=>$paidAmount,
            'due_amount'=>$dueAmount,
            'payment_status'=>$status
        ]);

        foreach ($request->medicines as $row) {

            if (!$row['medicine_id'] || $row['quantity'] <= 0) {
                continue;
            }

            $medicine = Medicine::where('user_id', Auth::id())
    ->find($row['medicine_id']);

            SaleDetail::create([
                'sale_id'=>$sale->id,
                'medicine_id'=>$row['medicine_id'],
                'quantity'=>$row['quantity']
            ]);

            // reduce stock
            $medicine->quantity -= $row['quantity'];
            $medicine->save();
        }

        return response()->json([
            'message'=>'Sale saved successfully'
        ]);
    }


    public function update(Request $request, $id){

        $sale = Sale::where('user_id', Auth::id())
    ->with('details')
    ->findOrFail($id);

        // restore old stock
        foreach ($sale->details as $detail) {

            $medicine = Medicine::find($detail->medicine_id);

            if ($medicine) {
                $medicine->quantity += $detail->quantity;
                $medicine->save();
            }
        }

        // delete old details
        SaleDetail::where('sale_id', $sale->id)->delete();

        $totalAmount = 0;

        foreach ($request->medicines as $row) {

            if (!$row['medicine_id'] || $row['quantity'] <= 0) {
                continue;
            }

            $medicine = Medicine::find($row['medicine_id']);

            if (!$medicine) {
                continue;
            }

            if ($row['quantity'] > $medicine->quantity) {
                return response()->json([
                    'error' => 'Not enough stock for '.$medicine->name
                ],422);
            }

            $totalAmount += $row['quantity'] * $medicine->sale_price;
        }

        $paidAmount = $request->paid_amount ?? 0;
        $dueAmount = $totalAmount - $paidAmount;

        $status = 'pending';

        if($paidAmount == 0){
            $status = 'pending';
        }
        elseif($paidAmount < $totalAmount){
            $status = 'partial';
        }
        else{
            $status = 'paid';
        }

        // update header
        $sale->update([
            'bill_no' => $request->bill_no,
            'patient_name' => $request->patient_name,
            'sale_date' => $request->sale_date,
            'total_amount'=>$totalAmount,
            'paid_amount'=>$paidAmount,
            'due_amount'=>$dueAmount,
            'payment_status'=>$status
        ]);

        foreach ($request->medicines as $row) {

            if (!$row['medicine_id'] || !$row['quantity']) {
                continue;
            }

            $medicine = Medicine::find($row['medicine_id']);

            if (!$medicine) {
                continue;
            }

            SaleDetail::create([
                'sale_id' => $sale->id,
                'medicine_id' => $row['medicine_id'],
                'quantity' => $row['quantity'],
            ]);

            $medicine->quantity -= $row['quantity'];
            $medicine->save();
        }

        return response()->json([
            'message' => 'Sale updated successfully'
        ]);
    }


    public function destroy($id){

        $sale = Sale::with('details')->findOrFail($id);

        // restore stock
        foreach ($sale->details as $detail) {

            $medicine = Medicine::find($detail->medicine_id);

            if ($medicine) {
                $medicine->quantity += $detail->quantity;
                $medicine->save();
            }
        }

        // delete details
        SaleDetail::where('sale_id', $sale->id)->delete();

        // delete sale
        $sale->delete();

        return response()->json([
            'message' => 'Sale deleted successfully'
        ]);
    }
}
