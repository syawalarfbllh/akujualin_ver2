<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shopee_shop_id',
        'shop_name',
        'region',
        'is_linked',
    ];

    // Relasi ke User pemilik toko
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Token (Satu toko punya satu set token aktif)
    public function token(): HasOne
    {
        return $this->hasOne(MarketplaceToken::class);
    }
}