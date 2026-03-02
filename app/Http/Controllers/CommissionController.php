<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Commission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CommissionController extends Controller
{
    // --- FITUR MAHASISWA ---
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'shopee_order_id' => 'required|unique:commissions,shopee_order_id',
        ]);

        $product = Product::findOrFail($request->product_id);

        Commission::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'shopee_order_id' => $request->shopee_order_id,
            'amount' => $product->commission_amount, // Ambil nominal komisi saat ini
            'status' => 'pending',
        ]);

        return back()->with('success', 'Klaim komisi berhasil dikirim!');
    }

    // --- FITUR STAFF UMKM ---
    public function index()
    {
        // Mengambil semua klaim yang masuk, lengkap dengan data mahasiswa dan produknya
        $commissions = Commission::with(['user', 'product'])
            ->latest()
            ->get();

        return Inertia::render('Staff/Commission/Index', [
            'commissions' => $commissions
        ]);
    }

    public function update(Request $request, Commission $commission)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'note' => 'nullable|string'
        ]);

        $commission->update([
            'status' => $request->status,
            'note' => $request->note
        ]);

        return back()->with('success', 'Status klaim berhasil diperbarui!');
    }

    public function history(Request $request)
    {
        $user = Auth::user();

        // Ambil input tanggal dari request
        $start = $request->input('start_date');
        $end = $request->input('end_date');

        $query = Commission::with('product')->where('user_id', $user->id);

        // Filter jika tanggal dipilih
        if ($start && $end) {
            $query->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59']);
        }

        $commissions = $query->latest()->get();

        // Hitung total dari data yang sudah terfilter
        $totalFiltered = $commissions->where('status', 'approved')->sum('amount');

        return Inertia::render('Mahasiswa/History', [
            'commissions' => $commissions,
            'summary' => [
                'total_income' => (float) $totalFiltered,
                'total_claims' => $commissions->count()
            ],
            'filters' => [
                'start' => $start,
                'end' => $end
            ]
        ]);
    }
    public function katalog()
    {
        // Mengambil semua produk untuk ditampilkan ke mahasiswa
        $products = \App\Models\Product::all();

        return Inertia::render('Mahasiswa/Katalog', [
            'products' => $products
        ]);
    }
}
