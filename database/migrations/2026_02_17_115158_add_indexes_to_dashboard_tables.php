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
        Schema::table('commissions', function (Blueprint $table) {
            // Index gabungan untuk mempercepat filter dashboard
            $table->index(['user_id', 'status', 'created_at']);
        });

        Schema::table('clicks', function (Blueprint $table) {
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dashboard_tables', function (Blueprint $table) {
            //
        });
    }
};
