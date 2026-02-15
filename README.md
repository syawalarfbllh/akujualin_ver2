# 🛒 Akujualin - Marketplace UMKM & Mahasiswa

Project ini adalah platform marketplace sederhana yang menghubungkan UMKM (Staff) dengan Mahasiswa, dibangun menggunakan **Laravel 11**, **Inertia.js (React)**, dan **Mantine UI**.

## 🛠️ Tech Stack
- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend:** React + Inertia.js
- **UI Framework:** Mantine UI v7
- **Database:** MySQL
- **Authentication:** Laravel Breeze (Customized with Roles)

---

## 📋 Prasyarat (Requirements)
Sebelum memulai, pastikan di komputer sudah terinstall:
1. **PHP** (Minimal v8.2)
2. **Composer**
3. **Node.js** & **NPM** (Gunakan versi LTS)
4. **MySQL** (Bisa via XAMPP, Laragon, atau Docker)

---

## 🚀 Cara Instalasi (Step-by-Step)

Ikuti langkah ini secara berurutan agar tidak terjadi error.

### 1. Clone atau Download Project
Masuk ke folder project melalui terminal/command prompt.

### 2. Install Dependencies
Install library backend dan frontend:

```bash
# Install paket PHP (Laravel)
composer install

# Install paket JavaScript (React/Mantine)
npm install

### 3. Setup Environment (.env)
Duplikat file contoh konfigurasi:

```bash
cp .env.example .env

Buka file .env tersebut, lalu sesuaikan konfigurasi Database:

### 4. Generate Key & Database
Jalankan perintah ini untuk mengisi APP_KEY dan membuat tabel beserta data dummy:

```bash
php artisan key:generate
php artisan migrate:fresh --seed

## 🏃‍♂️ Cara Menjalankan Aplikasi
Karena menggunakan Inertia/Vite, kamu perlu menjalankan Dua Terminal secara bersamaan.

```bash
php artisan serve
npm run dev


Buka browser dan akses: http://localhost:8000
