<?php

declare(strict_types=1);

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\MarketplaceToken;
use App\Services\Shopee\ShopeeAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ShopeeAuthController extends Controller
{
    public function __construct(
        protected ShopeeAuthService $shopeeService
    ) {}

    // 1. Redirect user ke Shopee Login
    public function connect()
    {
        $url = $this->shopeeService->generateAuthUrl();
        
        // Inertia External Redirect
        return inertia()->location($url);
    }

    // 2. Menangani kembalian dari Shopee
    public function callback(Request $request)
    {
        // Validasi input basic
        $code = $request->query('code');
        $shopId = (int) $request->query('shop_id'); // Shopee Shop ID

        if (!$code || !$shopId) {
            return to_route('staff.dashboard')->with('error', 'Otorisasi Shopee Dibatalkan.');
        }

        try {
            // A. Panggil Service untuk dapat token
            $tokenData = $this->shopeeService->swapCodeForToken($code, $shopId);

            // B. Database Transaction (Atomic Operation)
            DB::transaction(function () use ($tokenData, $request) {
                // 1. Simpan/Update Shop
                $shop = Shop::updateOrCreate(
                    ['shopee_shop_id' => $tokenData->shopId],
                    [
                        'user_id' => $request->user()->id,
                        'shop_name' => 'Shopee Shop ' . $tokenData->shopId, // Nanti diupdate via API detail
                        'is_linked' => true
                    ]
                );

                // 2. Simpan Token
                MarketplaceToken::updateOrCreate(
                    ['shop_id' => $shop->id],
                    [
                        'access_token' => $tokenData->accessToken,
                        'refresh_token' => $tokenData->refreshToken,
                        'expire_at' => now()->addSeconds($tokenData->expireInSeconds),
                    ]
                );
            });

            return to_route('staff.dashboard')->with('success', 'Toko Shopee Berhasil Terhubung!');

        } catch (\Exception $e) {
            Log::error('Callback Error: ' . $e->getMessage());
            return to_route('staff.dashboard')->with('error', 'Gagal menghubungkan toko. Silakan coba lagi.');
        }
    }
}