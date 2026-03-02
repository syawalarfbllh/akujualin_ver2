<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Click;
use Illuminate\Http\Request;

class RedirectController extends Controller
{
    public function handle(Request $request, $product_slug, $user_id)
    {
        $product = Product::where('slug', $product_slug)->firstOrFail();

        // 1. Catat Klik ke Database
        Click::create([
            'user_id' => $user_id,
            'product_id' => $product->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // 2. Redirect ke Link Shopee Asli
        return redirect()->away($product->product_link);
    }
}