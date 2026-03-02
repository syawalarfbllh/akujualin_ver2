<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('content_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Seller yang upload
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null'); // Opsional: Video ini untuk produk mana?
            $table->string('title');
            $table->string('video_path'); // Path file di storage
            $table->string('thumbnail_path')->nullable();
            $table->text('description')->nullable(); // Briefing untuk mahasiswa (misal: "Gunakan sound ini")
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_videos');
    }
};
