<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Di sini adalah tempat mendaftarkan semua route aplikasi.
| Middleware 'role' sudah kita daftarkan di bootstrap/app.php
|
*/

// --- 1. HALAMAN DEPAN (PUBLIC) ---
Route::get('/', function () {
    // Jika user sudah login, langsung lempar ke dashboard masing-masing
    if (Auth::check()) {
        $role = Auth::user()->role;
        return redirect()->route(
            $role === 'admin' ? 'admin.dashboard' :
            ($role === 'staff_umkm' ? 'staff.dashboard' : 'mahasiswa.dashboard')
        );
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- 2. DASHBOARD REDIRECTOR (PENYELAMAT) ---
// Jika user mengakses /dashboard (bawaan breeze), kita lempar ke role yang benar
Route::get('/dashboard', function () {
    $user = Auth::user();
    if (!$user) return redirect('/login');

    if ($user->role === 'admin') return redirect()->route('admin.dashboard');
    if ($user->role === 'staff_umkm') return redirect()->route('staff.dashboard');
    return redirect()->route('mahasiswa.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// --- 3. ROUTES KHUSUS USER LOGIN ---
Route::middleware(['auth', 'verified'])->group(function () {

    // ====================================================
    // A. GROUP ADMIN (Hanya bisa diakses role:admin)
    // ====================================================
    Route::middleware('role:admin')
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            
            Route::get('/dashboard', function () {
                return Inertia::render('Admin/Dashboard');
            })->name('dashboard'); // route name: admin.dashboard

            // Tambahkan route admin lainnya di sini (misal: manage user)
    });

    // ====================================================
    // B. GROUP STAFF UMKM (Hanya bisa diakses role:staff_umkm)
    // ====================================================
    Route::middleware('role:staff_umkm')
        ->prefix('staff')
        ->name('staff.')
        ->group(function () {
            
            Route::get('/dashboard', function () {
                return Inertia::render('Staff/Dashboard');
            })->name('dashboard'); // route name: staff.dashboard

            // Logic Shopee Dummy (Bypass)
            Route::get('/shopee/bypass', function () {
                // Simulasi connect sukses
                $user = Auth::user();
                // Di sini nanti logic update database shop -> is_linked = 1
                return redirect()->route('staff.dashboard')->with('success', 'Shopee Berhasil Terhubung (Mode Dev)!');
            })->name('shopee.bypass');

            // Logic Shopee Real (Placeholder)
            Route::get('/shopee/connect', function () {
                return redirect()->route('staff.dashboard')->with('error', 'API Shopee belum dikonfigurasi.');
            })->name('shopee.connect');
    });

    // ====================================================
    // C. GROUP MAHASISWA (Hanya bisa diakses role:mahasiswa)
    // ====================================================
    Route::middleware('role:mahasiswa')
        ->prefix('mahasiswa')
        ->name('mahasiswa.')
        ->group(function () {
            
            Route::get('/dashboard', function () {
                return Inertia::render('Mahasiswa/Dashboard');
            })->name('dashboard'); // route name: mahasiswa.dashboard

            // Tambahkan route mahasiswa lainnya (misal: list produk)
    });

    // ====================================================
    // D. PROFILE ROUTES (Bawaan Breeze)
    // ====================================================
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Load auth routes (login, register, forgot password, etc.)
require __DIR__.'/auth.php';