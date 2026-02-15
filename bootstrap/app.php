<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests; // <--- Wajib Import
use App\Http\Middleware\RoleMiddleware;        // <--- Wajib Import

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. Agar React bisa menerima data (Mencegah Layar Putih)
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        // 2. Agar Route bisa membaca 'role:admin', 'role:mahasiswa', dll
        $middleware->alias([
            'role' => RoleMiddleware::class, 
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();