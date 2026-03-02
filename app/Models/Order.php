<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    // Field yang boleh diisi secara massal
    protected $fillable = [
        'user_id',
        'order_number',
        'total_price',
        'status',
    ];

    /**
     * Relasi ke User (Mahasiswa/Affiliator)
     * Menandakan siapa yang mempromosikan produk hingga terjadi order ini.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope untuk mengambil order yang sukses saja
     * Digunakan untuk menghitung performa di Profile & Leaderboard
     */
    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }
}