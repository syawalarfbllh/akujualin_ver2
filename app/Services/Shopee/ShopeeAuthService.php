<?php

declare(strict_types=1);

namespace App\Services\Shopee;

use App\DTO\ShopeeTokenData;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class ShopeeAuthService
{
    private string $host;
    private int $partnerId;
    private string $partnerKey;

    public function __construct()
    {
        // Ambil config dari env/config file
        $this->host = config('services.shopee.host', 'https://partner.shopeemobile.com');
        $this->partnerId = (int) config('services.shopee.partner_id');
        $this->partnerKey = config('services.shopee.partner_key');
    }

    /**
     * Generate URL untuk User Login ke Shopee
     */
    public function generateAuthUrl(): string
    {
        $path = '/api/v2/shop/auth_partner';
        $timestamp = time();
        $baseString = sprintf('%s%s%s', $this->partnerId, $path, $timestamp);
        $sign = hash_hmac('sha256', $baseString, $this->partnerKey);

        // Redirect URL harus sama persis dengan yang didaftarkan di Shopee Console
        $redirectUrl = route('staff.shopee.callback'); 

        return sprintf(
            '%s%s?partner_id=%s&timestamp=%s&sign=%s&redirect=%s',
            $this->host, $path, $this->partnerId, $timestamp, $sign, $redirectUrl
        );
    }

    /**
     * Tukar Code (dari URL callback) menjadi Token
     */
    public function swapCodeForToken(string $code, int $shopId): ShopeeTokenData
    {
        // --- BYPASS LOGIC (MOCKING) ---
        // Jika kita di environment local DAN code-nya adalah 'testing_bypass'
        // Kita langsung return Token Palsu sukses.
        if (app()->isLocal() && $code === 'testing_bypass') {
            return new ShopeeTokenData(
                accessToken: 'access_token_palsu_' . \Illuminate\Support\Str::random(10),
                refreshToken: 'refresh_token_palsu_' . \Illuminate\Support\Str::random(10),
                expireInSeconds: 14400, // 4 jam
                shopId: $shopId,
                merchantId: 'merchant_palsu_1'
            );
        }
        // ------------------------------

        $path = '/api/v2/auth/token/get';
        $timestamp = time();
        
        // ... (kode asli request HTTP ke Shopee tetap ada di bawah sini) ...
        // Logic Sign API Shopee V2
        $baseString = sprintf('%s%s%s', $this->partnerId, $path, $timestamp);
        $sign = hash_hmac('sha256', $baseString, $this->partnerKey);

        $response = Http::post($this->host . $path . "?partner_id={$this->partnerId}&timestamp={$timestamp}&sign={$sign}", [
            'code' => $code,
            'shop_id' => $shopId,
            'partner_id' => $this->partnerId
        ]);

        if ($response->failed() || isset($response->json()['error'])) {
            // JANGAN throw exception dulu kalau lokal, return mock saja biar development jalan
            if (app()->isLocal()) {
                 return new ShopeeTokenData(
                    accessToken: 'access_token_fallback_' . \Illuminate\Support\Str::random(10),
                    refreshToken: 'refresh_token_fallback_' . \Illuminate\Support\Str::random(10),
                    expireInSeconds: 14400,
                    shopId: $shopId,
                    merchantId: 'merchant_fallback'
                );
            }

            Log::error('Shopee Token Error', $response->json());
            throw new RuntimeException('Gagal mendapatkan token Shopee: ' . $response->body());
        }

        return ShopeeTokenData::fromApiResponse($response->json());
    }
}