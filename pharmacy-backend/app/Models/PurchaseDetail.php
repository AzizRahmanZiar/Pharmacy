<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseDetail extends Model
{
   protected $fillable = [
    'purchase_id',
    'quantity',
    'name',
    'generic_name',
    'company',
    'family',
    'buy_price',
    'total_buyer_price',
    'profit_per_unit',
    'total_profit',
    'sale_price',
    'expiry_date',
];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
