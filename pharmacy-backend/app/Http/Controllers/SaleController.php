<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Medicine;

class SaleController extends Controller{

    public function index(){
        $sales = Sale::latest()->paginate(4);
        return response()->json($sales);
    }

    public function show($id){
        $sale = Sale::with('details.medicine')->find($id);
        return response()->json($sale);
    }

    public function formData(){
    return response()->json(Medicine::all());
    }

    public function store(Request $request){
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
    }



    $sale = Sale::create([
        'bill_no'=>$request->bill_no,
        'patient_name'=>$request->patient_name,
        'sale_date'=>$request->sale_date
    ]);



    foreach ($request->medicines as $row) {

        if (!$row['medicine_id'] || $row['quantity'] <= 0) {
            continue;
        }

        $medicine = Medicine::find($row['medicine_id']);

        SaleDetail::create([
            'sale_id'=>$sale->id,
            'medicine_id'=>$row['medicine_id'],
            'quantity'=>$row['quantity']
        ]);

        $medicine->quantity -= $row['quantity'];
        $medicine->save();
    }



    return response()->json([
        'message'=>'Sale saved successfully'
    ]);

    }


    public function update(Request $request, $id){
        $sale = Sale::with('details')->findOrFail($id);

        // 1️⃣ Restore old stock
        foreach ($sale->details as $detail) {

            $medicine = Medicine::find($detail->medicine_id);

            if ($medicine) {
                $medicine->quantity += $detail->quantity;
                $medicine->save();
            }
        }

        // 2️⃣ Delete old details
        SaleDetail::where('sale_id', $sale->id)->delete();

        // 3️⃣ Update header
        $sale->update([
            'bill_no' => $request->bill_no,
            'patient_name' => $request->patient_name,
            'sale_date' => $request->sale_date,
        ]);

        // 4️⃣ Save new details
        foreach ($request->medicines as $row) {

            if (!$row['medicine_id'] || !$row['quantity']) {
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

            SaleDetail::create([
                'sale_id' => $sale->id,
                'medicine_id' => $row['medicine_id'],
                'quantity' => $row['quantity'],
            ]);

            // reduce stock
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

