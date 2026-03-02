<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Click extends Model
{
    protected $fillable = ['user_id', 'product_id', 'ip_address', 'user_agent'];

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
