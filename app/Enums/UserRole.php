<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Mahasiswa = 'mahasiswa';
    case StaffUmkm = 'staff_umkm';

    public function label(): string
    {
        return match($this) {
            self::SuperAdmin => 'Administrator',
            self::Mahasiswa => 'Affiliator (Mahasiswa)',
            self::StaffUmkm => 'Staff UMKM',
        };
    }
}