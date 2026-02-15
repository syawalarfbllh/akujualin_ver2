<?php

declare(strict_types=1);

namespace App\DTO;

readonly class ShopeeTokenData
{
    public function __construct(
        public string $accessToken,
        public string $refreshToken,
        public int $expireInSeconds,
        public int $shopId, // Shopee Shop ID
        public string $merchantId // Kadang dibutuhkan
    ) {}

    // Factory method untuk parsing response raw dari Shopee
    public static function fromApiResponse(array $data): self
    {
        return new self(
            accessToken: $data['access_token'],
            refreshToken: $data['refresh_token'],
            expireInSeconds: (int) $data['expire_in'],
            shopId: (int) ($data['shop_id'] ?? 0),
            merchantId: (string) ($data['merchant_id'] ?? '')
        );
    }
}