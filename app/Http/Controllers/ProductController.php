<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('user_id', Auth::id())->latest()->get();
        return Inertia::render('Staff/Product/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Product/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'commission_amount' => 'required|numeric',
            'stock' => 'required|numeric',
            'description' => 'nullable|string',
            'product_link' => 'nullable|url',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'video_url' => 'required|mimetypes:video/mp4,video/quicktime|max:51200',
            'video_brief' => 'nullable|string',
        ]);

        // Simpan Gambar
        $imagePath = $request->file('image')->store('products/images', 'public');

        // Simpan Video
        $videoPath = $request->file('video_url')->store('products/videos', 'public');

        Product::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . time(),
            'price' => $validated['price'],
            'commission_amount' => $validated['commission_amount'],
            'stock' => $validated['stock'],
            'description' => $validated['description'],
            'product_link' => $validated['product_link'],
            'image' => $imagePath, // Menggunakan kolom 'image' sesuai controller asli
            'video_url' => $videoPath, // Pastikan kolom ini ada di migrasi
            'video_brief' => $validated['video_brief'],
        ]);

        return redirect()->route('staff.product.index')->with('message', 'Produk dan konten video berhasil dibuat!');
    }

    public function edit(Product $product)
    {
        if ($product->user_id !== Auth::id()) abort(403);
        return Inertia::render('Staff/Product/Edit', ['product' => $product]);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->user_id !== Auth::id()) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'commission_amount' => 'required|numeric',
            'stock' => 'required|numeric',
            'description' => 'nullable|string',
            'product_link' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
            'video_url' => 'required|mimes:mp4,mov,avi|max:50000',
            'video_brief' => 'nullable|string',
        ]);

        // Logika Update Image
        if ($request->hasFile('image')) {
            if ($product->image) Storage::disk('public')->delete($product->image);
            $product->image = $request->file('image')->store('products/images', 'public');
        }

        // Logika Update Video
        if ($request->hasFile('video_url')) {
            if ($product->video_url) Storage::disk('public')->delete($product->video_url);
            $product->video_url = $request->file('video')->store('products/videos', 'public');
        }

        $product->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'commission_amount' => $validated['commission_amount'],
            'stock' => $validated['stock'],
            'description' => $validated['description'],
            'product_link' => $validated['product_link'],
            'video_brief' => $validated['video_brief'],
            'image' => $product->image,
            'video_url' => $product->video_url,
        ]);

        return redirect()->route('staff.product.index')->with('message', 'Produk diperbarui!');
    }

    public function destroy(Product $product)
    {
        if ($product->user_id !== Auth::id()) abort(403);

        // Hapus Gambar fisik
        if ($product->image) Storage::disk('public')->delete($product->image);

        // Hapus Video fisik
        if ($product->video_url) Storage::disk('public')->delete($product->video_url);

        $product->delete();
        return redirect()->back()->with('message', 'Produk dan konten terkait dihapus!');
    }

    // Katalog Mahasiswa dengan relasi lengkap
    public function katalog()
    {
        return Inertia::render('Mahasiswa/Katalog', [
            'products' => Product::with('user')->latest()->get()
        ]);
    }

    public function syncShopee()
    {
        // Simulasi: Mengambil data dari Shopee API (Mocking)
        // Di sini nantinya kamu akan memanggil HTTP Client ke Shopee Open Platform

        sleep(2); // Efek loading

        return back()->with('success', 'Data produk dan pesanan dari Shopee berhasil disinkronkan!');
    }

    public function trackClick($product_id, $student_id)
    {
        $product = \App\Models\Product::findOrFail($product_id);

        // Logika: Tambah jumlah klik di produk
        $product->increment('click_count');

        // Opsional: Simpan log klik ke tabel 'clicks' jika ingin data lebih detail (siapa, kapan, perangkat apa)

        // Lempar ke link Shopee UMKM
        return redirect()->away($product->product_link);
    }
}
