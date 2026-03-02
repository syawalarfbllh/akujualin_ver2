<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

    // Kolom yang boleh diisi secara massal
    protected $fillable = [
        'user_id',
        'product_id',
        'shopee_order_id',
        'amount',
        'price_at_time',
        'proof_image',
        'status',
        'note',
    ];

    /**
     * Relasi ke User (Mahasiswa yang mengajukan klaim)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Product (Produk yang diklaim)
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}