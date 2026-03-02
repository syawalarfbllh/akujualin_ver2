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
        Schema::table('users', function (Blueprint $table) {
            $table->string('whatsapp')->nullable()->after('email');
            $table->string('tiktok_username')->nullable()->after('whatsapp');
            $table->string('instagram_username')->nullable()->after('tiktok_username');
            $table->text('bio')->nullable()->after('instagram_username');
            $table->string('level')->default('Newbie')->after('role'); // Untuk Leaderboard nanti
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['whatsapp', 'tiktok_username', 'instagram_username', 'bio', 'level']);
        });
    }
};
