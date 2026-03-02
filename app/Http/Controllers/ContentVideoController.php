<?php

namespace App\Http\Controllers;

use App\Models\ContentVideo;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContentVideoController extends Controller
{
    // --- UNTUK STAFF / SELLER ---

    // Menampilkan daftar video yang sudah diupload seller tersebut
    public function index()
    {
        return Inertia::render('Staff/Content/Index', [
            'videos' => ContentVideo::with('product')
                ->where('user_id', Auth::id())
                ->latest()
                ->get(),
            'products' => Product::where('user_id', Auth::id())->get() // Untuk pilihan saat upload
        ]);
    }

    // Proses simpan video
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:100',
            'description' => 'nullable',
            'product_id' => 'nullable|exists:products,id',
            'video' => 'required|mimetypes:video/mp4,video/x-matroska,video/quicktime|max:51200', // Max 50MB
        ]);

        $path = $request->file('video')->store('content-videos', 'public');

        ContentVideo::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'title' => $request->title,
            'description' => $request->description,
            'video_path' => $path,
        ]);

        return back()->with('success', 'Video berhasil diunggah!');
    }

    // --- UNTUK MAHASISWA ---

    // Menampilkan semua video dari semua seller untuk bahan promosi
    public function library()
    {
        return Inertia::render('Mahasiswa/ContentLibrary', [
            'videos' => ContentVideo::with(['product', 'user'])->latest()->get()
        ]);
    }

    public function destroy(ContentVideo $contentVideo)
    {
        // Pastikan hanya pemilik video yang bisa menghapus
        if ($contentVideo->user_id !== Auth::id()) {
            abort(403);
        }

        // Hapus file dari folder storage/app/public/content-videos
        if (Storage::disk('public')->exists($contentVideo->video_path)) {
            Storage::disk('public')->delete($contentVideo->video_path);
        }

        $contentVideo->delete();

        return back()->with('success', 'Konten berhasil dihapus.');
    }
}
