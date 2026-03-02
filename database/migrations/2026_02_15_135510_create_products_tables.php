<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // Menyimpan ID penjual (Staff UMKM)
            // onDelete('cascade') artinya: kalau akun staff dihapus, produknya ikut terhapus
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('name');         // Nama Produk (Contoh: Keripik Pisang)
            $table->string('slug');         // URL ramah SEO (Contoh: keripik-pisang)
            $table->integer('price');       // Harga
            $table->integer('stock');       // Stok barang
            $table->string('image')->nullable(); // Foto produk (boleh kosong dulu)
            $table->text('description')->nullable(); // Deskripsi detail
            
            $table->timestamps(); // Created_at & Updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};