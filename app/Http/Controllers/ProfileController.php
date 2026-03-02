<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // 1. Ambil semua data dari request
        $data = $request->all();

        // 2. Logika Khusus Upload Avatar (jika ada file)
        if ($request->hasFile('avatar')) {
            // Hapus foto lama jika bukan default dan filenya ada
            if ($user->avatar && file_exists(public_path($user->avatar))) {
                unlink(public_path($user->avatar));
            }

            $file = $request->file('avatar');
            $fileName = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
            // Simpan ke public/uploads/avatars
            $file->move(public_path('uploads/avatars'), $fileName);
            $data['avatar'] = '/uploads/avatars/' . $fileName;
        } else {
            // Jika tidak ada upload baru, jangan timpa kolom avatar dengan null
            unset($data['avatar']);
        }

        // 3. Masukkan data ke model (fillable akan menyaring field yang diizinkan)
        $user->fill($data);

        // 4. Cek jika email berubah (fitur bawaan Laravel Breeze)
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function marketplace()
{
    // Mengambil user dengan role mahasiswa yang sudah mengisi data profile
    $affiliates = User::where('role', 'mahasiswa')
        ->select([
            'id', 'name', 'avatar', 'bio', 'whatsapp', 
            'instagram_username', 'ig_followers', 
            'tiktok_followers', 'bank_name'
        ])
        ->get();

    return Inertia::render('Staff/Affiliate/Marketplace', [
        'affiliates' => $affiliates
    ]);
}
}
