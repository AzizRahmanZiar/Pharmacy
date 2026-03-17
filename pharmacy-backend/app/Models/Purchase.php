<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
  protected $fillable = [
    'bill_no',
    'purchase_date',
    'total_amount',
    'paid_amount',
    'due_amount',
    'payment_status'
];

    public function details()
    {
        return $this->hasMany(PurchaseDetail::class);
    }
}
