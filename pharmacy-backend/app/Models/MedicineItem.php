<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineItem extends Model
{
    protected $fillable = [
        'name',
        'generic_name',
        'company',
        'family'
    ];

}
