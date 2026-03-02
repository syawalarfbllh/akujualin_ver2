<?php

namespace App\Http\Controllers;

use App\Models\Click;
use App\Models\Commission;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Filter tanggal (Default 30 hari)
        $start = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $end = $request->input('end_date', now()->format('Y-m-d'));
        $dateStart = $start . ' 00:00:00';
        $dateEnd = $end . ' 23:59:59';

        // --- DASHBOARD ADMIN ---
        // --- 1. DASHBOARD ADMIN (UPDATE INI) ---
        if ($user->role === 'admin') {
            // Query Dasar untuk transaksi sukses (Approved)
            $approvedCommissions = Commission::where('status', 'approved')
                ->whereBetween('created_at', [$dateStart, $dateEnd]);

            // 1. CHART OMZET NASIONAL (Gross Merchandise Value)
            $chartOmzet = (clone $approvedCommissions)
                ->selectRaw('DATE(created_at) as date, SUM(price_at_time) as total')
                ->groupBy('date')->orderBy('date', 'ASC')->get()
                ->map(fn($item) => ['date' => Carbon::parse($item->date)->format('d M'), 'amount' => (float)$item->total]);

            // 2. CHART KOMISI AFFILIATE (Total Payout)
            $chartCommission = (clone $approvedCommissions)
                ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
                ->groupBy('date')->orderBy('date', 'ASC')->get()
                ->map(fn($item) => ['date' => Carbon::parse($item->date)->format('d M'), 'amount' => (float)$item->total]);

            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'total_umkm' => User::where('role', 'staff_umkm')->count(),
                    'total_mahasiswa' => User::where('role', 'mahasiswa')->count(),
                    // Omzet seluruh seller
                    'total_omzet' => (clone $approvedCommissions)->sum('price_at_time'),
                    // Total yang harus dibayarkan seller ke mahasiswa
                    'total_payout' => (clone $approvedCommissions)->sum('amount'),
                    // Data pending global (untuk alert admin)
                    'total_pending' => Commission::where('status', 'pending')->count(),
                ],
                // Kirim 2 Chart
                'chart_omzet' => $chartOmzet,
                'chart_commission' => $chartCommission,
                'filters' => ['start' => $start, 'end' => $end],
            ]);
        }

        // --- 2. DASHBOARD STAFF UMKM (LOGIKA SELLER - UPDATE DISINI) ---
        if ($user->role === 'staff_umkm') {
            // Query Dasar: Semua komisi dari produk milik user ini
            $baseQuery = Commission::whereHas('product', fn($q) => $q->where('user_id', $user->id));

            // 1. DATA CHART OMZET (Gross Sales - Hijau)
            // Menggunakan 'price_at_time'
            $chartOmzet = (clone $baseQuery)
                ->where('status', 'approved')
                ->whereBetween('created_at', [$dateStart, $dateEnd])
                ->selectRaw('DATE(created_at) as date, SUM(price_at_time) as total')
                ->groupBy('date')->orderBy('date', 'ASC')->get()
                ->map(fn($item) => [
                    'date' => Carbon::parse($item->date)->format('d M'),
                    'amount' => (float)$item->total
                ]);

            // 2. DATA CHART KOMISI (Expenses - Merah/Orange)
            // Menggunakan 'amount' (Komisi yang dibayar ke mahasiswa)
            $chartCommission = (clone $baseQuery)
                ->where('status', 'approved')
                ->whereBetween('created_at', [$dateStart, $dateEnd])
                ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
                ->groupBy('date')->orderBy('date', 'ASC')->get()
                ->map(fn($item) => [
                    'date' => Carbon::parse($item->date)->format('d M'),
                    'amount' => (float)$item->total
                ]);

            return Inertia::render('Staff/Dashboard', [
                'stats' => [
                    'totalProducts' => Product::where('user_id', $user->id)->count(),
                    'waitingValidation' => (clone $baseQuery)->where('status', 'pending')->count(),

                    // Total Omzet (Pemasukan Kotor)
                    'total_omzet' => (float) (clone $baseQuery)
                        ->where('status', 'approved')
                        ->whereBetween('created_at', [$dateStart, $dateEnd])
                        ->sum('price_at_time'),

                    // Total Komisi (Pengeluaran)
                    'total_commission' => (float) (clone $baseQuery)
                        ->where('status', 'approved')
                        ->whereBetween('created_at', [$dateStart, $dateEnd])
                        ->sum('amount'),
                ],
                // Kirim 2 dataset chart
                'chart_omzet' => $chartOmzet,
                'chart_commission' => $chartCommission,
                'filters' => ['start' => $start, 'end' => $end]
            ]);
        }

        // --- 3. DASHBOARD MAHASISWA (LOGIKA AFFILIATE) ---
        if ($user->role === 'mahasiswa') {
            $baseCommission = Commission::where('user_id', $user->id);

            $stats = [
                // Mahasiswa melihat KOMISI (Pendapatan dia)
                'totalEarnings' => (float) (clone $baseCommission)->where('status', 'approved')
                    ->whereBetween('created_at', [$dateStart, $dateEnd])->sum('amount'),
                'pendingClaims' => (int) (clone $baseCommission)->where('status', 'pending')->count(),
                'totalClicks' => (int) Click::where('user_id', $user->id)
                    ->whereBetween('created_at', [$dateStart, $dateEnd])->count(),
                'successSales' => (int) (clone $baseCommission)->where('status', 'approved')
                    ->whereBetween('created_at', [$dateStart, $dateEnd])->count(),
            ];

            $chartData = (clone $baseCommission)
                ->where('status', 'approved')
                ->whereBetween('created_at', [$dateStart, $dateEnd])
                ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
                ->groupBy('date')->orderBy('date', 'ASC')->get()
                ->map(fn($item) => [
                    'date' => Carbon::parse($item->date)->format('d M'),
                    'amount' => (float)$item->total
                ]);

            return Inertia::render('Mahasiswa/Dashboard', [
                'stats' => $stats,
                'chartData' => $chartData,
                'recentClaims' => (clone $baseCommission)->with(['product'])->latest()->take(5)->get(),
                'filters' => ['start' => $start, 'end' => $end]
            ]);
        }

        return redirect('/');
    }

    // 1. Pantau Seluruh Mahasiswa (Affiliator)
    public function monitorMahasiswa()
    {
        $data = User::where('role', 'mahasiswa')
            ->withSum(['commissions as total_pendapatan' => function ($query) {
                $query->where('status', 'approved');
            }], 'amount')
            ->withCount(['commissions as total_order' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->get();

        return Inertia::render('Admin/Monitor/Mahasiswa', ['data' => $data]);
    }

    // 2. Pantau Seluruh Staff UMKM (Seller)
    public function monitorStaffUMKM()
    {
        $data = User::where('role', 'staff_umkm')
            // Pendapatan Kotor UMKM (Total harga produk terjual)
            ->withSum(['commissions as total_omzet' => function ($query) {
                $query->where('status', 'approved');
            }], 'price_at_time')
            // Total Komisi yang harus mereka bayarkan ke mahasiswa
            ->withSum(['commissions as total_hutang_komisi' => function ($query) {
                $query->where('status', 'approved');
            }], 'amount')
            ->get();

        return Inertia::render('Admin/Monitor/Staff', ['data' => $data]);
    }
    // Di DashboardController atau CommissionController (sesuai route Anda)
    public function adminClaims(Request $request)
    {
        // Ambil data untuk Dropdown Filter
        $sellers = User::where('role', 'staff_umkm')->select('id', 'name')->get();

        $query = Commission::query()
            ->with(['user', 'product.seller']); // Load relasi

        // 1. Filter Search (Nama Mahasiswa / Order ID)
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('shopee_order_id', 'like', '%' . $request->search . '%')
                    ->orWhereHas('user', function ($u) use ($request) {
                        $u->where('name', 'like', '%' . $request->search . '%');
                    });
            });
        }

        // 2. Filter Status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // 3. Filter Seller (UMKM)
        if ($request->seller_id) {
            $query->whereHas('product', function ($p) use ($request) {
                $p->where('user_id', $request->seller_id);
            });
        }

        // 4. Filter Nama Produk
        if ($request->product_name) {
            $query->whereHas('product', function ($p) use ($request) {
                $p->where('name', 'like', '%' . $request->product_name . '%');
            });
        }

        $commissions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Claims/Index', [
            'commissions' => $commissions,
            'sellers' => $sellers, // Kirim data seller untuk dropdown
            'filters' => $request->only(['search', 'status', 'seller_id', 'product_name']),
        ]);
    }

    // --- SISA METHOD (ADMIN USERS & PRODUCTS) ---
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

    public function adminProducts()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::with('user')->latest()->get()
        ]);
    }

}
