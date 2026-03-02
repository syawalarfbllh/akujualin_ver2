<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentVideo extends Model
{
    protected $fillable = ['user_id', 'product_id', 'title', 'description', 'video_path'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class); // Seller
    }
}
