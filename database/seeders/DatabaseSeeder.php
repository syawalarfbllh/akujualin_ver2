<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Akun ADMIN
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin', // Ejaan harus persis dengan check di Controller
        ]);

        // 2. Buat Akun STAFF UMKM
        User::create([
            'name' => 'Juragan Kripik',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff_umkm', // Ejaan harus persis
        ]);

        // 3. Buat Akun MAHASISWA
        User::create([
            'name' => 'Mahasiswa Teladan',
            'email' => 'mahasiswa@example.com',
            'password' => Hash::make('password'),
            'role' => 'mahasiswa', // Ejaan harus persis
        ]);
    }
}