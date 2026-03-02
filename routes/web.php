<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CommissionController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// --- 1. HALAMAN DEPAN (PUBLIC) ---
Route::get('/', function () {
    if (Auth::check()) {
        $role = Auth::user()->role;
        return redirect()->route(
            $role === 'admin' ? 'admin.dashboard' : ($role === 'staff_umkm' ? 'staff.dashboard' : 'mahasiswa.dashboard')
        );
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- 2. DASHBOARD REDIRECTOR (Global /dashboard URL) ---
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


// --- 3. ROUTES KHUSUS USER LOGIN ---
Route::middleware(['auth', 'verified'])->group(function () {

    // ====================================================
    // A. GROUP ADMIN
    // ====================================================
    Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/users', [DashboardController::class, 'usersIndex'])->name('users.index');

        // Monitoring Menu (Read-Only)
        Route::get('/monitoring-produk', [DashboardController::class, 'adminProducts'])->name('products.index');
        Route::get('/monitoring-klaim', [DashboardController::class, 'adminClaims'])->name('claims.index');

        Route::patch('/users/{user}/toggle-status', [DashboardController::class, 'userToggle'])->name('users.toggle');
        Route::delete('/users/{user}', [DashboardController::class, 'userDestroy'])->name('users.destroy');
    });

    // ====================================================
    // B. GROUP STAFF UMKM
    // ====================================================
    Route::middleware('role:staff_umkm')
        ->prefix('staff')
        ->name('staff.')
        ->group(function () {

            // Menggunakan Controller untuk Dashboard agar stats terkirim
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

            // Shopee Connect
            Route::get('/shopee/bypass', function () {
                return redirect()->route('staff.dashboard')->with('success', 'Shopee Terhubung!');
            })->name('shopee.bypass');

            Route::get('/shopee/connect', function () {
                return redirect()->route('staff.dashboard')->with('error', 'API Shopee belum siap.');
            })->name('shopee.connect');

            // Product UMKM (CRUD)
            Route::get('/produk', [ProductController::class, 'index'])->name('product.index');
            Route::get('/produk/tambah', [ProductController::class, 'create'])->name('product.create');
            Route::post('/produk', [ProductController::class, 'store'])->name('product.store');
            Route::get('/produk/{product}/edit', [ProductController::class, 'edit'])->name('product.edit');
            // Gunakan POST untuk update jika ada upload file (Inertia limitation workaround)
            Route::post('/produk/{product}', [ProductController::class, 'update'])->name('product.update');
            Route::delete('/produk/{product}', [ProductController::class, 'destroy'])->name('product.destroy');

            // Commission Validation (Untuk Approve/Reject)
            Route::get('/commissions', [CommissionController::class, 'index'])->name('commission.index');
            Route::patch('/commissions/{commission}', [CommissionController::class, 'update'])->name('commission.update');
        });

    // ====================================================
    // C. GROUP MAHASISWA
    // ====================================================
    Route::middleware('role:mahasiswa')
        ->prefix('mahasiswa')
        ->name('mahasiswa.')
        ->group(function () {

            // Menggunakan Controller untuk Dashboard agar stats terkirim
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

            // Product / Katalog
            Route::get('/katalog', [CommissionController::class, 'katalog'])->name('katalog');

            // Commission / Klaim
            Route::post('/claim-commission', [CommissionController::class, 'store'])->name('claim.store');
            Route::get('/riwayat-klaim', [CommissionController::class, 'history'])->name('claim.history');
        });

    // ====================================================
    // D. PROFILE & AFFILIATE SYSTEM
    // ====================================================
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Affiliate Tracking
    Route::get('/ref/{product_id}/{student_id}', [ProductController::class, 'trackClick'])->name('affiliate.track');
});

require __DIR__ . '/auth.php';
