<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMonitorController extends Controller
{
    // 1. Monitor Staff UMKM (Seller)
    public function umkm()
    {
        $sellers = User::where('role', 'staff_umkm')
            ->withCount('products') // Hitung total produk
            // Hitung Total Omzet (Harga jual produk yang laku)
            ->withSum(['sellerCommissions as total_omzet' => function ($query) {
                $query->where('status', 'approved');
            }], 'price_at_time') // Pastikan kolom ini ada, atau ganti 'amount'
            // Hitung Total Komisi yang harus dibayarkan ke mahasiswa
            ->withSum(['sellerCommissions as total_payout' => function ($query) {
                $query->where('status', 'approved');
            }], 'amount')
            ->orderByDesc('total_omzet') // Urutkan dari omzet tertinggi
            ->paginate(10);

        return Inertia::render('Admin/Monitor/Umkm', [
            'sellers' => $sellers
        ]);
    }

    // 2. Monitor Mahasiswa (Affiliator)
    public function mahasiswa()
    {
        $students = User::where('role', 'mahasiswa')
            // Hitung total uang yang didapat mahasiswa
            ->withSum(['commissions as total_earned' => function ($query) {
                $query->where('status', 'approved');
            }], 'amount')
            // Hitung total transaksi sukses
            ->withCount(['commissions as total_sales' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->orderByDesc('total_earned')
            ->paginate(10);

        return Inertia::render('Admin/Monitor/Mahasiswa', [
            'students' => $students
        ]);
    }
    public function leaderboard()
    {
        // 1. DATA MAHASISWA (Penerima Komisi Terbanyak)
        $topStudents = User::where('role', 'mahasiswa')
            ->withSum('commissions', 'amount') // Asumsi relasi user->commissions ada
            ->orderByDesc('commissions_sum_amount')
            ->take(10)
            ->get();

        // 2. DATA SELLER/UMKM (Pemberi Komisi Terbesar)
        // Kita cari User staff_umkm, lalu hitung total komisi dari produk-produk mereka
        $topSellers = User::where('role', 'staff_umkm')
            ->with(['products.commissions']) // Eager load
            ->get()
            ->map(function ($seller) {
                // Hitung total komisi dari semua produk milik seller ini
                $totalPayout = $seller->products->flatMap(function ($product) {
                    return $product->commissions;
                })->sum('amount');

                $seller->total_payout = $totalPayout;
                return $seller;
            })
            ->sortByDesc('total_payout') // Urutkan manual collection
            ->take(10)
            ->values(); // Reset array keys

        return Inertia::render('Admin/Monitor/Leaderboard', [
            'topStudents' => $topStudents,
            'topSellers' => $topSellers
        ]);
    }
}
