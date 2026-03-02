<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['user_id', 'affiliate_id'];

    // Relasi ke Affiliator (User)
    public function affiliate()
    {
        return $this->belongsTo(User::class, 'affiliate_id');
    }
}