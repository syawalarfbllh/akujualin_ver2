<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Commission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CommissionExport;

class CommissionController extends Controller
{
    // --- FITUR MAHASISWA ---
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'shopee_order_id' => 'required|unique:commissions,shopee_order_id',
            // Validasi gambar maksimal 2MB
            'proof_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $product = Product::findOrFail($request->product_id);

        // --- LOGIKA UPLOAD GAMBAR ---
        $proofPath = null;
        if ($request->hasFile('proof_image')) {
            // Gambar akan disimpan di folder: storage/app/public/proofs
            $proofPath = $request->file('proof_image')->store('proofs', 'public');
        }

        Commission::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'shopee_order_id' => $request->shopee_order_id,
            'amount' => $product->commission_amount,
            'price_at_time' => $product->price,
            'status' => 'pending',
            'proof_image' => $proofPath, // <-- Simpan path gambar ke database
            'created_at'    => now(),
        ]);

        return back()->with('success', 'Klaim komisi beserta bukti berhasil dikirim!');
    }

    // --- FITUR STAFF UMKM ---
    public function index(Request $request)
    {
        // Gunakan collect agar lebih mudah memanipulasi data input
        $filters = collect($request->only(['date_start', 'date_end']))
            ->filter() // Menghapus input yang nilainya null atau string kosong
            ->toArray();

        $startDate = $filters['date_start'] ?? null;
        $endDate = $filters['date_end'] ?? null;

        $query = Commission::with(['user', 'product']);

        // Filter Tanggal
        $query->when($startDate, function ($q) use ($startDate) {
            return $q->whereDate('created_at', '>=', $startDate);
        });

        $query->when($endDate, function ($q) use ($endDate) {
            return $q->whereDate('created_at', '<=', $endDate);
        });

        $commissions = $query->latest()->get();

        return Inertia::render('Staff/Commission/Index', [
            'commissions' => $commissions,
            'filters' => [
                'date_start' => $startDate,
                'date_end' => $endDate,
            ]
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
    public function exportExcel(Request $request)
    {
        $fileName = 'laporan-komisi-' . now()->format('Y-m-d') . '.xlsx';

        // Kirim filter tanggal ke class Export
        return Excel::download(
            new CommissionExport($request->date_start, $request->date_end),
            $fileName
        );
    }
}
