<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Medicine;
use App\Models\MedicineItem;
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller{

    public function index(Request $request)
    {
        $query = Purchase::where('user_id', Auth::id())->withSum('details', 'total_buyer_price')
            ->withSum('details', 'total_profit')
            ->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('payment_status', $request->status);
        }

        $purchases = $query->paginate(4);

        return response()->json($purchases);
    }


    public function show($id){
        $purchase = Purchase::where('user_id', Auth::id())->with('details')->find($id);

        if (!$purchase) {
            return response()->json([
                'message' => 'Purchase not found'
            ],404);
        }

        return response()->json($purchase);
    }


    public function formData(){
        $names = MedicineItem::where('user_id', Auth::id())->select('name')->distinct()->get();
        $generics = MedicineItem::where('user_id', Auth::id())->select('generic_name')->distinct()->get();
        $companies = MedicineItem::where('user_id', Auth::id())->select('company')->distinct()->get();
        $families = MedicineItem::where('user_id', Auth::id())->select('family')->distinct()->get();

        return response()->json([
            'names' => $names,
            'generics' => $generics,
            'companies' => $companies,
            'families' => $families,
        ]);
    }


    public function store(Request $request){

$request->validate([
    'bill_no' => 'required|string',
    'purchase_date' => 'required|date',
    'paid_amount' => 'nullable|numeric|min:0',
    'medicines' => 'required|array',

    'medicines.*.name' => 'required|string',
    'medicines.*.generic_name' => 'nullable|string',
    'medicines.*.company' => 'nullable|string',
    'medicines.*.family' => 'nullable|string',

    'medicines.*.quantity' => 'required|integer|min:1',
    'medicines.*.buy_price' => 'required|numeric|min:0',
    'medicines.*.sale_price' => 'required|numeric|min:0',
]);

$totalAmount = 0;

foreach ($request->medicines as $row) {
    $totalAmount += $row['quantity'] * $row['buy_price'];
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

$purchase = Purchase::create([
    'user_id'=>Auth::id(),
    'bill_no'=>$request->bill_no,
    'purchase_date'=>$request->purchase_date,
    'total_amount'=>$totalAmount,
    'paid_amount'=>$paidAmount,
    'due_amount'=>$dueAmount,
    'payment_status'=>$status
]);

foreach ($request->medicines as $row) {

    $name = $row['name'];
    $generic = $row['generic_name'] ?? null;
    $company = $row['company'] ?? null;
    $family = $row['family'] ?? null;
    $quantity = $row['quantity'];
    $buyPrice = $row['buy_price'];
    $salePrice = $row['sale_price'];
    $expiry = $row['expiry_date'] ?? null;

    $totalBuyerPrice = $quantity * $buyPrice;
    $profitPerUnit = $salePrice - $buyPrice;
    $totalProfit = $profitPerUnit * $quantity;

    PurchaseDetail::create([
        'purchase_id' => $purchase->id,
        'name' => $name,
        'generic_name' => $generic,
        'company' => $company,
        'family' => $family,
        'quantity' => $quantity,
        'buy_price' => $buyPrice,
        'sale_price' => $salePrice,
        'expiry_date' => $expiry,
        'total_buyer_price' => $totalBuyerPrice,
        'profit_per_unit' => $profitPerUnit,
        'total_profit' => $totalProfit,
    ]);

    Medicine::create([
        'user_id'=> Auth::id(),
        'name' => $name,
        'generic_name' => $generic,
        'company' => $company,
        'family' => $family,
        'quantity' => $quantity,
        'buy_price' => $buyPrice,
        'sale_price' => $salePrice,
        'expiry_date' => $expiry,
        'total_buyer_price' => $totalBuyerPrice,
    ]);
}

return response()->json([
    'success' => true,
    'purchase_id' => $purchase->id
]);

}


    public function update(Request $request, $id)
{
    $request->validate([
        'bill_no' => 'required|string',
        'purchase_date' => 'required|date',
        'paid_amount' => 'nullable|numeric|min:0',
        'medicines' => 'required|array',

        'medicines.*.name' => 'required|string',
        'medicines.*.generic_name' => 'nullable|string',
        'medicines.*.company' => 'nullable|string',
        'medicines.*.family' => 'nullable|string',
        'medicines.*.quantity' => 'required|integer|min:1',
        'medicines.*.buy_price' => 'required|numeric|min:0',
        'medicines.*.sale_price' => 'required|numeric|min:0',
        'medicines.*.expiry_date' => 'nullable|date',
    ]);

    $purchase = Purchase::where('user_id', Auth::id())->with('details')->findOrFail($id);

    // 1. Remove old stock related to this purchase
    foreach ($purchase->details as $detail) {
        $medicine = Medicine::where('user_id', Auth::id())->where('name', $detail->name)
            ->where('generic_name', $detail->generic_name)
            ->where('company', $detail->company)
            ->where('expiry_date', $detail->expiry_date)
            ->first();

        if ($medicine) {
            $medicine->delete(); // delete only this batch
        }
    }

    // 2. Delete old purchase details
    $purchase->details()->delete();

    // 3. Calculate totals based on new medicines
    $totalAmount = 0;
    foreach ($request->medicines as $row) {
        $totalAmount += $row['quantity'] * $row['buy_price'];
    }

    $paidAmount = $request->paid_amount ?? 0;
    $dueAmount = $totalAmount - $paidAmount;

    // Determine payment status
    if ($paidAmount == 0) {
        $status = 'pending';
    } elseif ($paidAmount < $totalAmount) {
        $status = 'partial';
    } else {
        $status = 'paid';
    }

    // 4. Update purchase info with new financial data
    $purchase->update([
        'bill_no' => $request->bill_no,
        'purchase_date' => $request->purchase_date,
        'total_amount' => $totalAmount,
        'paid_amount' => $paidAmount,
        'due_amount' => $dueAmount,
        'payment_status' => $status,
    ]);

    // 5. Insert new details and new medicine batches
    foreach ($request->medicines as $row) {
        $name = $row['name'];
        $generic = $row['generic_name'] ?? null;
        $company = $row['company'] ?? null;
        $family = $row['family'] ?? null;
        $quantity = $row['quantity'];
        $buyPrice = $row['buy_price'];
        $salePrice = $row['sale_price'];
        $expiry = $row['expiry_date'] ?? null;

        $totalBuyerPrice = $quantity * $buyPrice;
        $profitPerUnit = $salePrice - $buyPrice;
        $totalProfit = $profitPerUnit * $quantity;

        // Create purchase detail
        $detail = PurchaseDetail::create([
            'purchase_id' => $purchase->id,
            'name' => $name,
            'generic_name' => $generic,
            'company' => $company,
            'family' => $family,
            'quantity' => $quantity,
            'buy_price' => $buyPrice,
            'sale_price' => $salePrice,
            'expiry_date' => $expiry,
            'total_buyer_price' => $totalBuyerPrice,
            'profit_per_unit' => $profitPerUnit,
            'total_profit' => $totalProfit,
        ]);

        // Create new Medicine record (no combination)
        Medicine::create([
            'user_id'=> Auth::id(),
            'name' => $name,
            'generic_name' => $generic,
            'company' => $company,
            'family' => $family,
            'quantity' => $quantity,
            'buy_price' => $buyPrice,
            'sale_price' => $salePrice,
            'expiry_date' => $expiry,
            'total_buyer_price' => $totalBuyerPrice,
            // If you have purchase_detail_id column, add it here for better tracking
            // 'purchase_detail_id' => $detail->id,
        ]);
    }

    return response()->json(['success' => true]);
}

    public function destroy($id){
        $purchase = Purchase::where('user_id', Auth::id())->with('details')->findOrFail($id);
        // 1. Remove stock from medicines
        foreach ($purchase->details as $detail) {

            $medicine = Medicine::where('user_id', Auth::id())->where('name', $detail->name)
                ->where('generic_name', $detail->generic_name)
                ->where('company', $detail->company)
->where('expiry_date', $detail->expiry_date)
                ->first();

            if ($medicine) {

                $medicine->quantity -= $detail->quantity;
                $medicine->total_buyer_price -= $detail->total_buyer_price;

                if ($medicine->quantity <= 0) {
                    $medicine->delete();
                } else {
                    $medicine->save();
                }
            }
        }


        // 2. Delete purchase details
        $purchase->details()->delete();
        // 3. Delete purchase

        $purchase->delete();

        return response()->json([
            'success' => true,
            'message' => 'Purchase deleted successfully'
        ]);
    }
}
