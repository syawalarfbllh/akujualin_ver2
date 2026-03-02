<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MahasiswaAffiliateSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'Rizky Ramadhan',
                'email' => 'rizky@example.com',
                'ig' => 15400,
                'tiktok' => 25000,
                'bio' => 'Gadget reviewer & tech enthusiast.'
            ],
            [
                'name' => 'Siti Aminah',
                'email' => 'siti@example.com',
                'ig' => 8500,
                'tiktok' => 45000,
                'bio' => 'Fashion enthusiast, suka share outfit harian!'
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'ig' => 1200,
                'tiktok' => 1500,
                'bio' => 'Mahasiswa Teknik yang hobi ngopi dan review cafe.'
            ],
            [
                'name' => 'Andini Putri',
                'email' => 'andini@example.com',
                'ig' => 50000,
                'tiktok' => 120000,
                'bio' => 'Beauty vlogger, fokus di skincare lokal.'
            ],
        ];

        foreach ($data as $item) {
            User::create([
                'name' => $item['name'],
                'email' => $item['email'],
                'password' => Hash::make('password'),
                'role' => 'mahasiswa', // Pastikan kolom role ada di tabel users
                'whatsapp' => '62812345678' . rand(10, 99),
                'bio' => $item['bio'],
                'ig_followers' => $item['ig'],
                'tiktok_followers' => $item['tiktok'],
                'avatar' => null, // Biarkan pakai inisial nama di frontend
            ]);
        }
    }
}
