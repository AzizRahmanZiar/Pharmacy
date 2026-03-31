<?php


namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Medicine;
use App\Models\MedicineItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::where('user_id', Auth::id())
            ->withSum('details', 'total_buyer_price')
            ->withSum('details', 'total_profit')
            ->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('payment_status', $request->status);
        }

        return response()->json($query->paginate(3));
    }

    public function show($id)
    {
        $purchase = Purchase::where('user_id', Auth::id())
            ->with('details')
            ->find($id);

        if (!$purchase) {
            return response()->json(['message' => 'Purchase not found'], 404);
        }

        return response()->json($purchase);
    }


    public function formData(){
        $generic = MedicineItem::where('user_id', Auth::id())->select('generic')->distinct()->get();
        $brand = MedicineItem::where('user_id', Auth::id())->select('brand')->distinct()->get();
        $dosage = MedicineItem::where('user_id', Auth::id())->select('dosage')->distinct()->get();
        $strength = MedicineItem::where('user_id', Auth::id())->select('strength')->distinct()->get();
        $route = MedicineItem::where('user_id', Auth::id())->select('route')->distinct()->get();

        return response()->json([
            'generic' => $generic,
            'brand' => $brand,
            'dosage' => $dosage,
            'strength' => $strength,
            'route' => $route,
        ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'bill_no' => 'required|string',
            'purchase_date' => 'required|date',
            'paid_amount' => 'nullable|numeric|min:0',
            'medicines' => 'required|array',

            // ✅ YOUR NEW FIELDS
            'medicines.*.generic' => 'required|string|max:255',
            'medicines.*.brand' => 'required|string|max:255',
            'medicines.*.dosage' => 'required|string|max:255',
            'medicines.*.strength' => 'required|string|max:255',
            'medicines.*.route' => 'required|string|max:255',

            'medicines.*.quantity' => 'required|integer|min:1',
            'medicines.*.buy_price' => 'required|numeric|min:0',
            'medicines.*.sale_price' => 'required|numeric|min:0',
            'medicines.*.expiry_date' => 'nullable|date',
        ]);

        $totalAmount = 0;
        foreach ($request->medicines as $row) {
            $totalAmount += $row['quantity'] * $row['buy_price'];
        }

        $paidAmount = $request->paid_amount ?? 0;
        $dueAmount = $totalAmount - $paidAmount;

        $status = $paidAmount == 0 ? 'pending'
            : ($paidAmount < $totalAmount ? 'partial' : 'paid');

        $purchase = Purchase::create([
            'user_id' => Auth::id(),
            'bill_no' => $request->bill_no,
            'purchase_date' => $request->purchase_date,
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'due_amount' => $dueAmount,
            'payment_status' => $status,
        ]);

        foreach ($request->medicines as $row) {

            $totalBuyerPrice = $row['quantity'] * $row['buy_price'];
            $profitPerUnit = $row['sale_price'] - $row['buy_price'];
            $totalProfit = $profitPerUnit * $row['quantity'];

            PurchaseDetail::create([
                'purchase_id' => $purchase->id,

                // ✅ NEW FIELDS
                'generic' => $row['generic'],
                'brand' => $row['brand'],
                'dosage' => $row['dosage'],
                'strength' => $row['strength'],
                'route' => $row['route'],

                'quantity' => $row['quantity'],
                'buy_price' => $row['buy_price'],
                'sale_price' => $row['sale_price'],
                'expiry_date' => $row['expiry_date'] ?? null,
                'total_buyer_price' => $totalBuyerPrice,
                'profit_per_unit' => $profitPerUnit,
                'total_profit' => $totalProfit,
            ]);

            Medicine::create([
                'user_id' => Auth::id(),

                // ✅ NEW FIELDS
                'generic' => $row['generic'],
                'brand' => $row['brand'],
                'dosage' => $row['dosage'],
                'strength' => $row['strength'],
                'route' => $row['route'],

                'quantity' => $row['quantity'],
                'buy_price' => $row['buy_price'],
                'sale_price' => $row['sale_price'],
                'expiry_date' => $row['expiry_date'] ?? null,
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

            'medicines.*.generic' => 'required|string|max:255',
            'medicines.*.brand' => 'required|string|max:255',
            'medicines.*.dosage' => 'required|string|max:255',
            'medicines.*.strength' => 'required|string|max:255',
            'medicines.*.route' => 'required|string|max:255',

            'medicines.*.quantity' => 'required|integer|min:1',
            'medicines.*.buy_price' => 'required|numeric|min:0',
            'medicines.*.sale_price' => 'required|numeric|min:0',
            'medicines.*.expiry_date' => 'nullable|date',
        ]);

        $purchase = Purchase::where('user_id', Auth::id())
            ->with('details')
            ->findOrFail($id);

        $purchase->details()->delete();

        $totalAmount = 0;
        foreach ($request->medicines as $row) {
            $totalAmount += $row['quantity'] * $row['buy_price'];
        }

        $paidAmount = $request->paid_amount ?? 0;
        $dueAmount = $totalAmount - $paidAmount;

        $status = $paidAmount == 0 ? 'pending'
            : ($paidAmount < $totalAmount ? 'partial' : 'paid');

        $purchase->update([
            'bill_no' => $request->bill_no,
            'purchase_date' => $request->purchase_date,
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'due_amount' => $dueAmount,
            'payment_status' => $status,
        ]);

        foreach ($request->medicines as $row) {

            $totalBuyerPrice = $row['quantity'] * $row['buy_price'];
            $profitPerUnit = $row['sale_price'] - $row['buy_price'];
            $totalProfit = $profitPerUnit * $row['quantity'];

            PurchaseDetail::create([
                'purchase_id' => $purchase->id,
                'generic' => $row['generic'],
                'brand' => $row['brand'],
                'dosage' => $row['dosage'],
                'strength' => $row['strength'],
                'route' => $row['route'],
                'quantity' => $row['quantity'],
                'buy_price' => $row['buy_price'],
                'sale_price' => $row['sale_price'],
                'expiry_date' => $row['expiry_date'] ?? null,
                'total_buyer_price' => $totalBuyerPrice,
                'profit_per_unit' => $profitPerUnit,
                'total_profit' => $totalProfit,
            ]);

            $medicine = Medicine::where([
            'user_id' => Auth::id(),
            'generic' => $row['generic'],
            'brand' => $row['brand'],
            'dosage' => $row['dosage'],
            'strength' => $row['strength'],
            'route' => $row['route'],
            'buy_price' => $row['buy_price'],
        ])->first();

        if ($medicine) {
            // ✅ update existing record
            $medicine->update([
                'quantity' => $row['quantity'],
                'sale_price' => $row['sale_price'],
                'expiry_date' => $row['expiry_date'] ?? null,
                'total_buyer_price' => $totalBuyerPrice,
            ]);
        }
        }

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $purchase = Purchase::where('user_id', Auth::id())
            ->with('details')
            ->findOrFail($id);

        $purchase->details()->delete();
        $purchase->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully'
        ]);
    }






public function purchaseTableReport(Request $request)
{
    $status = $request->query('status'); // paid, partial, pending, all

    $query = Purchase::withSum('details', 'total_buyer_price')
        ->withSum('details', 'total_profit');

    if ($status && $status !== 'all') {
        $query->where('payment_status', $status);
    }

    $purchases = $query->orderBy('id', 'desc')->get();

    // Generate current date/time in your timezone
    $currentDateTime = Carbon::now('Asia/Kabul')->format('F j, Y, g:i A');

    $pdf = Pdf::loadView('reports.purchase-table', [
        'purchases'       => $purchases,
        'status'          => $status ?? 'all',
        'currentDateTime' => $currentDateTime, // Pass to view
    ]);

    return $pdf->download('purchase-report-' . ($status ?? 'all') . '.pdf');
}
}
