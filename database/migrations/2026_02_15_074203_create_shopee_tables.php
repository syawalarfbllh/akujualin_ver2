<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tabel Toko (Master Data)
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('shopee_shop_id')->unique(); // ID dari Shopee
            $table->string('shop_name');
            $table->string('region')->default('ID');
            $table->boolean('is_linked')->default(true);
            $table->timestamps();
        });

        // Tabel Token (Sensitive Data)
        Schema::create('marketplace_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            // Text karena token Shopee sangat panjang
            $table->text('access_token');
            $table->text('refresh_token');
            // Timestamp kapan token mati (biasanya 4 jam)
            $table->timestamp('expire_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopee_tables');
    }
};
