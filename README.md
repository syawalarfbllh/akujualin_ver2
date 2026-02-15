PANDUAN INSTALASI PROJECT (AKUJUALIN)

Prasyarat:

PHP (v8.2 ke atas)

Composer

Node.js & NPM

Database MySQL (XAMPP/Laragon)

Langkah-langkah:

Download & Ekstrak

Jika via Git: git clone <link-repo>

Jika via Zip: Ekstrak folder project.

Install Dependencies (Backend & Frontend)
Buka terminal di dalam folder project, lalu jalankan:

Bash
composer install
npm install
Setup Environment (.env)

Copy file .env.example menjadi .env:

Bash
cp .env.example .env
Buka file .env, atur koneksi database:

Ini, TOML
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=akujualin  <-- Pastikan buat database ini di MySQL
DB_USERNAME=root
DB_PASSWORD=
Generate Key & Migrasi Database
Jalankan perintah ini di terminal:

Bash
php artisan key:generate
php artisan migrate:fresh --seed
(Penting: --seed akan membuatkan akun admin, staff, dan mahasiswa otomatis)

Jalankan Server
Kamu butuh dua terminal yang jalan bersamaan:

Terminal 1 (Laravel):

Bash
php artisan serve
Terminal 2 (Vite/React):

Bash
npm run dev
Login Credentials (Akun Dummy)
Buka browser di http://127.0.0.1:8000, login pakai akun ini:

Admin: admin@example.com | pass: password

Staff: staff@example.com | pass: password

Mhs: mahasiswa@example.com | pass: password

Selamat coding! 🚀
