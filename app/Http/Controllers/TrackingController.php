<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function handle(Product $product, User $user)
    {
        // 1. Simpan Log Klik ke Database
        \App\Models\Click::create([
            'product_id' => $product->id,
            'user_id'    => $user->id, // Mahasiswa yang share
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        // 2. Redirect ke Link Shopee yang sudah diinput Seller di database
        // Pastikan kolom di tabel produk namanya 'shopee_link'
        return redirect()->away($product->shopee_link);
    }
}
