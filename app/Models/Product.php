<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Kolom yang boleh diisi secara massal
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'price',
        'commission_amount',
        'stock',
        'image',
        'description',
        'product_link'
    ];
    // Relasi: Setiap Produk dimiliki oleh satu User (Staff)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }
}
