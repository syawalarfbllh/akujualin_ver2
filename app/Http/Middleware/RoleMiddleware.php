<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        // 1. Jika user belum login, lempar ke login
        if (! $request->user()) {
            return redirect()->route('login');
        }

        // 2. Cek apakah role di database SAMA dengan role yang diminta route
        if ($request->user()->role !== $role) {
            // Jika beda, blokir akses (403 Forbidden)
            abort(403, 'Akses Ditolak. Role Anda tidak sesuai.');
        }

        return $next($request);
    }
}
