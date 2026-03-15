<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
    'bill_no',
    'patient_name',
    'sale_date',
];

    public function details()
    {
        return $this->hasMany(SaleDetail::class);
    }
}
