<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{
    protected $fillable = [
        'name',
        'owner_name',
        'email',
        'phone',
        'status',
        'expiry_date'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
