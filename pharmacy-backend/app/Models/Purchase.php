<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = ['bill_no','purchase_date'];

    public function details()
    {
        return $this->hasMany(PurchaseDetail::class);
    }
}
