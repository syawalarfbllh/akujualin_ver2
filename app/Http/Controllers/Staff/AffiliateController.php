<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AffiliateController extends Controller
{
    public function index()
    {
        $currentUserId = Auth::id();

        $affiliates = User::where('role', 'mahasiswa')
            ->select([
                'id',
                'name',
                'avatar',
                'bio',
                'whatsapp',
                'ig_followers',
                'tiktok_followers'
            ])
            // Menghitung Total Penjualan untuk Ranking
            ->withSum(['commissions as total_sales' => function ($query) {
                $query->where('status', 'approved');
            }], 'amount')
            ->withCount(['commissions as total_orders' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->withExists(['favorites as is_favorite' => function ($query) use ($currentUserId) {
                $query->where('user_id', $currentUserId);
            }])
            // Urutkan berdasarkan penjualan terbanyak (Leaderboard Logic)
            ->orderByDesc('total_sales')
            ->get()
            ->map(function ($user, $index) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar,
                    'bio' => $user->bio ?? 'Affiliator aktif Akujualin',
                    // Ranking berdasarkan urutan array (karena sudah di-orderByDesc)
                    'rank' => $index + 1,
                    'total_sales_value' => (float) ($user->total_sales ?? 0),
                    'total_orders' => $user->total_orders ?? 0,
                    'ig_followers' => $user->ig_followers ?? 0,
                    'tiktok_followers' => $user->tiktok_followers ?? 0,
                    'is_favorite' => (bool) $user->is_favorite,
                    'whatsapp' => $user->whatsapp,
                ];
            });

        return Inertia::render('Staff/Affiliate/Index', [
            'affiliates' => $affiliates
        ]);
    }
    public function show($id)
    {
        // Fungsi show Anda sudah bagus, tinggal pastikan key-nya konsisten dengan Index
        $affiliate = User::where('role', 'mahasiswa')->findOrFail($id);

        $stats = [
            'total_clicks' => DB::table('clicks')
                ->where('user_id', $affiliate->id)
                ->count(),

            'total_orders' => DB::table('commissions')
                ->where('user_id', $affiliate->id)
                ->where('status', 'approved')
                ->count(),

            'total_sales'  => DB::table('commissions')
                ->where('user_id', $affiliate->id)
                ->where('status', 'approved')
                ->sum('amount'),

            'rank' => 1 + DB::table('commissions')
                ->selectRaw('user_id, SUM(amount) as total_amount')
                ->where('status', 'approved')
                ->groupBy('user_id')
                ->having('total_amount', '>', DB::table('commissions')
                    ->where('user_id', $affiliate->id)
                    ->where('status', 'approved')
                    ->sum('amount'))
                ->count()
        ];

        return Inertia::render('Staff/Affiliate/Show', [
            'affiliate' => array_merge($affiliate->toArray(), $stats)
        ]);
    }
    public function favorites()
    {
        $currentUserId = Auth::id();

        $favorites = \App\Models\Favorite::where('user_id', $currentUserId)
            ->with(['affiliate' => function ($query) {
                $query->withCount(['commissions as total_orders' => function ($q) {
                    $q->where('status', 'approved');
                }])
                    ->withSum(['commissions as total_sales'], 'amount');
            }])
            ->get()
            ->map(function ($fav) {
                $user = $fav->affiliate;
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar,
                    'bio' => $user->bio,
                    'ig_followers' => $user->ig_followers,
                    'tiktok_followers' => $user->tiktok_followers,
                    'total_orders' => $user->total_orders ?? 0,
                    'total_sales_value' => $user->total_sales ?? 0,
                    'is_favorite' => true, // Di halaman ini pasti true
                    'whatsapp' => $user->whatsapp,
                ];
            });

        return Inertia::render('Staff/Affiliate/Favorites', [
            'affiliates' => $favorites
        ]);
    }
    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'affiliate_id' => 'required|exists:users,id'
        ]);

        $userId = Auth::id();
        $affiliateId = $request->affiliate_id;

        // Cari apakah sudah ada di favorit
        $favorite = Favorite::where('user_id', $userId)
            ->where('affiliate_id', $affiliateId)
            ->first();

        if ($favorite) {
            $favorite->delete(); // Jika ada, hapus (unfavorite)
        } else {
            Favorite::create([ // Jika tidak ada, tambah (favorite)
                'user_id' => $userId,
                'affiliate_id' => $affiliateId
            ]);
        }

        // Sangat penting: kembali ke halaman sebelumnya dengan data terbaru
        return back();
    }
    public function leaderboard()
    {
        // Ambil data dasar mahasiswa dengan agregasi yang dibutuhkan
        $affiliates = User::where('role', 'mahasiswa')
            ->withSum(['commissions as total_sales_value' => function ($query) {
                $query->where('status', 'approved');
            }], 'amount')
            ->withCount(['commissions as total_orders' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->get();

        // 1. Kategori Nilai Jual (Berdasarkan Rupiah terbanyak)
        $bySalesValue = $affiliates->sortByDesc('total_sales_value')
            ->values()
            ->map(fn($user, $index) => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'rank' => $index + 1,
                'value' => (float) ($user->total_sales_value ?? 0),
                'orders' => $user->total_orders ?? 0,
            ]);

        // 2. Kategori Pesanan (Berdasarkan Jumlah Order terbanyak)
        $byOrdersCount = $affiliates->sortByDesc('total_orders')
            ->values()
            ->map(fn($user, $index) => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'rank' => $index + 1,
                'value' => $user->total_orders ?? 0, // Nilai utama di sini adalah jumlah order
                'sales_amount' => (float) ($user->total_sales_value ?? 0), // Simpan rupiah sebagai info tambahan
            ]);

        return Inertia::render('Staff/Affiliate/Leaderboard', [
            'leaderboardData' => [
                'sales' => $bySalesValue,
                'orders' => $byOrdersCount // Key berubah dari commission menjadi orders
            ]
        ]);
    }

    // Helper function untuk format data agar seragam
    private function formatLeaderboard($user, $index, $type)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'avatar' => $user->avatar,
            'rank' => $index + 1,
            'value' => $type === 'sales' ? $user->tiktok_followers : $user->total_komisi,
            'label' => $type === 'sales' ? 'Followers' : 'IDR',
        ];
    }
}
