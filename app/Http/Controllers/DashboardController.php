<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Commission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Default filter: 30 hari terakhir
        $start = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $end = $request->input('end_date', now()->format('Y-m-d'));

        // Helper untuk Chart
        $getChartData = function ($query) use ($start, $end) {
            return $query->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59'])
                ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
                ->groupBy('date')
                ->orderBy('date', 'ASC')
                ->get();
        };

        // --- DASHBOARD ADMIN ---
        if ($user->role === 'admin') {
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'total_umkm' => User::where('role', 'staff_umkm')->count(),
                    'total_mahasiswa' => User::where('role', 'mahasiswa')->count(),
                    'total_transaksi' => (float) Commission::where('status', 'approved')
                        ->whereBetween('created_at', [$start, $end])->sum('amount'),
                ],
                'chart_data' => $getChartData(Commission::where('status', 'approved')),
                'filters' => ['start' => $start, 'end' => $end],
                'recent_commissions' => Commission::with(['user', 'product'])->latest()->limit(5)->get()
            ]);
        }

        if ($user->role === 'staff_umkm') {
            // Query dasar untuk komisi milik produk user ini
            $baseQuery = Commission::whereHas('product', fn($q) => $q->where('user_id', $user->id));

            return Inertia::render('Staff/Dashboard', [
                'stats' => [
                    'totalProducts' => Product::where('user_id', $user->id)->count(),
                    // HAPUS filter tanggal untuk waitingValidation agar semua tugas terlihat
                    'waitingValidation' => (clone $baseQuery)->where('status', 'pending')->count(),
                    // Tetap gunakan filter untuk nominal uang (performa)
                    'total_transaksi' => (float) (clone $baseQuery)->where('status', 'approved')
                        ->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59'])->sum('amount'),
                ],
                'chart_data' => $getChartData((clone $baseQuery)->where('status', 'approved')),
                'filters' => ['start' => $start, 'end' => $end]
            ]);
        }

        // --- DASHBOARD MAHASISWA ---
        if ($user->role === 'mahasiswa') {
            $baseQuery = Commission::where('user_id', $user->id);

            // Data Statistik yang terfilter tanggal
            $stats = [
                // Gunakan nama camelCase agar konsisten dengan React Anda
                'totalEarnings' => (float) (clone $baseQuery)->where('status', 'approved')
                    ->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59'])->sum('amount'),
                'pendingClaims' => (clone $baseQuery)->where('status', 'pending')->count(),
                'totalSales'    => (clone $baseQuery)->where('status', 'approved')
                    ->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59'])->count(),
            ];

            // Riwayat Klaim yang juga ikut terfilter tanggal
            $recentClaims = (clone $baseQuery)->with('product')
                ->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59'])
                ->latest()
                ->get();

            return Inertia::render('Mahasiswa/Dashboard', [
                'stats' => $stats,
                'chart_data' => $getChartData((clone $baseQuery)->where('status', 'approved')),
                'filters' => ['start' => $start, 'end' => $end],
                'recentClaims' => $recentClaims
            ]);
        }

        return redirect('/');
    }

    public function usersIndex()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::where('id', '!=', Auth::id())->latest()->get()
        ]);
    }

    public function userToggle(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return back();
    }

    public function userDestroy(User $user)
    {
        $user->delete();
        return back();
    }

    // Lihat Seluruh Produk (Read-Only)
    public function adminProducts()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => \App\Models\Product::with('user')->latest()->get()
        ]);
    }

    // Lihat Seluruh Klaim (Read-Only)
    public function adminClaims()
    {
        return Inertia::render('Admin/Claims/Index', [
            'commissions' => \App\Models\Commission::with(['user', 'product'])->latest()->get()
        ]);
    }
}
