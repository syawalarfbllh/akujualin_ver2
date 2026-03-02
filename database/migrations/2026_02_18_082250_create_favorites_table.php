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
        Schema::create('favorites', function (Blueprint $composer) {
            $composer->id();
            $composer->foreignId('user_id')->constrained()->onDelete('cascade'); // Siapa yang memfavoritkan (Admin/Staff)
            $composer->foreignId('affiliate_id')->constrained('users')->onDelete('cascade'); // Affiliator yang difavoritkan
            $composer->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
