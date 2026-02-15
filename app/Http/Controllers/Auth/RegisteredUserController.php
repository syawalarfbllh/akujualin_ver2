<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // ... validasi kode sebelumnya biarkan saja ...

        // Pastikan saat create user, role juga tersimpan
        // Sesuaikan validasi role sesuai kebutuhan Anda
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'mahasiswa', // Default Role saat daftar mandiri
        ]);

        event(new Registered($user));

        Auth::login($user);

        // --- REDIRECT KE DASHBOARD MAHASISWA ---
        return redirect(route('mahasiswa.dashboard', absolute: false));
    }
}
