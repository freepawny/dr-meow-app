# Pembagian Tugas Kelompok (2 Orang) – Pertemuan 11 (Sprint 09)

**Proyek:** Dr. Meow Application (`dr-meow-laravel`)  
**Fokus Sprint:** *Build Secure API (JWT Authentication)*  
**Referensi:** [LANGKAH-PERTEMUAN-11.md](./LANGKAH-PERTEMUAN-11.md) & [target-per-pertemuan.md](../../target-per-pertemuan.md)

---

## Strategi Kerja Paralel (Zero Merge Conflict)

Agar kedua anggota dapat langsung bekerja **secara bersamaan (paralel)** tanpa saling menunggu dan tanpa konflik file saat *merge* Git, pembagian tugas dipisahkan berdasarkan **batas file yang berbeda**:

| Aspek | Anggota 1 (Auth Core & Database) | Anggota 2 (Route Security & QA/Testing) |
|---|---|---|
| **Fokus Utama** | Setup JWT package, database `users`, `User` model, & `AuthController` (`POST /api/login`) | Proteksi `routes/api.php`, handling `401` di `bootstrap/app.php`, & Postman/Insomnia Test Suite |
| **Branch Git** | `feat/week11-jwt-core` | `feat/week11-jwt-routes-testing` |
| **File yang Disentuh** | `composer.json`, `composer.lock`, `config/jwt.php`, `config/auth.php`, `database/migrations/*_create_users_table.php`, `database/seeders/UserSeeder.php`, `app/Models/User.php`, `app/Http/Controllers/Api/AuthController.php` | `routes/api.php`, `bootstrap/app.php`, file export koleksi Postman/Insomnia (misal `docs/DrMeow-Week11-JWT.postman_collection.json`) |
| **Cakupan Langkah** | Langkah 1 (Konsep), Langkah 2, Langkah 3, Langkah 4 | Langkah 5, Langkah 6 (Persiapan & Eksekusi Uji) |

> **Catatan Kontrak Antar Anggota:**  
> Anggota 2 dapat langsung menulis `routes/api.php` dan koleksi Postman menggunakan nama class & method yang sudah disepakati bersama:
> - Controller: `App\Http\Controllers\Api\AuthController` (`login`, `me`, `logout`)
> - Guard middleware: `auth:api`
> - Endpoint login: `POST /api/login` dengan payload `{"email": "admin@drmeow.test", "password": "password123"}` dan respon `access_token` + `token_type: "bearer"`.

---

## Rincian Tugas Per Anggota

### Anggota 1: JWT Core, Database Users & Login Endpoint

**Tujuan:** Menyediakan fondasi autentikasi JWT, data pengguna di database, dan endpoint `POST /api/login` yang menghasilkan token valid.

**Daftar Tugas:**
- [ ] **1. Persiapan Konsep Demo (Langkah 1):**
  - Menyiapkan poin penjelasan singkat untuk demo: perbedaan *Session-based* vs *Token-based (JWT)* serta struktur JWT (*Header.Payload.Signature*).
- [ ] **2. Migration & Seeder `users` (Langkah 2):**
  - Membuat migration `create_users_table` (`php artisan make:migration create_users_table`) dengan kolom `id`, `name`, `email` (unique), `email_verified_at`, `password`, `rememberToken`, `timestamps`.
  - Membuat `database/seeders/UserSeeder.php` untuk akun uji coba (`admin@drmeow.test` / `password123`).
  - Menjalankan `php artisan migrate` dan `php artisan db:seed --class=UserSeeder`.
- [ ] **3. Instalasi & Konfigurasi JWT (Langkah 3):**
  - Install package: `composer require php-open-source-saver/jwt-auth`.
  - Publish config: `php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"`.
  - Generate secret: `php artisan jwt:secret`.
  - Update `app/Models/User.php` agar mengimplementasikan `JWTSubject` (`getJWTIdentifier()` dan `getJWTCustomClaims()`).
  - Tambahkan guard `'api' => ['driver' => 'jwt', 'provider' => 'users']` pada `config/auth.php`.
- [ ] **4. Implementasi `AuthController` (Langkah 4):**
  - Buat `app/Http/Controllers/Api/AuthController.php`.
  - Implementasikan method `login(Request $request)` dengan validasi `email` & `password`, mengembalikan JSON `access_token`, `token_type: 'bearer'`, dan `expires_in` (status `200`), atau `401` jika kredensial salah.
  - Implementasikan method `me()` dan `logout()`.
- [ ] **5. Commit & Push Branch:**
  - `git commit -m "feat(week-11): setup jwt-auth, users migration, seeder, and AuthController"`
  - Push ke branch `feat/week11-jwt-core`.

---

### Anggota 2: Route Protection, 401 Handling & Postman/Insomnia Suite

**Tujuan:** Memastikan seluruh endpoint resource API terlindungi oleh middleware `auth:api`, error `401 Unauthorized` selalu berformat JSON rapi, serta seluruh skenario pengujian terdokumentasi di Postman/Insomnia.

**Daftar Tugas:**
- [ ] **1. Konfigurasi Protected Routes (Langkah 5.1):**
  - Update `routes/api.php`:
    - Daftarkan `Route::post('/login', [AuthController::class, 'login']);` sebagai endpoint **publik**.
    - Pertahankan `GET /api/v1/health` sebagai endpoint **publik**.
    - Bungkus endpoint `/me`, `/logout`, `services`, `customers` (beserta `/cats` & `/reservations`), `cats`, dan `reservations` di dalam `Route::middleware('auth:api')->group(...)`.
- [ ] **2. Penanganan `401 Unauthorized` JSON (Langkah 5.2):**
  - Update `bootstrap/app.php` pada bagian `withExceptions` agar `AuthenticationException` untuk `api/*` selalu mengembalikan respon JSON status `401` (`success: false, message: 'Unauthorized'`) tanpa mencoba redirect ke halaman login web.
- [ ] **3. Penyusunan Koleksi Postman / Insomnia (Langkah 6):**
  - Siapkan *Collection* dan *Environment* (`base_url = http://127.0.0.1:8000`, `token = ""`) yang mencakup 8 skenario wajib:
    1. `POST /api/login` — Valid credentials (`200 OK`, otomatis simpan `access_token` ke variable `{{token}}`).
    2. `POST /api/login` — Invalid credentials (`401 Unauthorized`).
    3. `POST /api/login` — Payload kosong / validasi error (`422 Unprocessable Entity`).
    4. `GET /api/v1/services` — Tanpa header `Authorization` (`401 Unauthorized`).
    5. `GET /api/v1/services` — Dengan token salah (`Authorization: Bearer invalid_token` → `401 Unauthorized`).
    6. `GET /api/v1/services` — Dengan token valid (`Authorization: Bearer {{token}}` → `200 OK`).
    7. Operasi `POST`, `PUT`/`PATCH`, `DELETE` pada salah satu resource (`services`/`customers`/`cats`/`reservations`) dengan token valid (`201`/`200`).
    8. `GET /api/v1/health` — Public endpoint tanpa token (`200 OK`).
  - Export koleksi ke file JSON di repo (misal `docs/DrMeow-Week11-JWT.postman_collection.json`) sebagai bukti & cadangan demo.
- [ ] **4. Commit & Push Branch:**
  - `git commit -m "feat(week-11): protect API routes with auth:api, handle 401 JSON, and add Postman suite"`
  - Push ke branch `feat/week11-jwt-routes-testing`.

---

## Fase Integrasi & Verifikasi Bersama (Setelah Kedua Branch Selesai)

Setelah Anggota 1 dan Anggota 2 selesai melakukan *push* ke branch masing-masing:

1. **Merge ke Branch Utama Kerja (misal `main` atau `week-11`):**
   - Merge `feat/week11-jwt-core` terlebih dahulu, lalu merge `feat/week11-jwt-routes-testing`.
2. **Sinkronisasi Lingkungan Lokal (di laptop masing-masing):**
   ```bash
   git pull
   composer install
   php artisan migrate
   php artisan db:seed --class=UserSeeder
   php artisan jwt:secret
   php artisan route:list --path=api
   ```
3. **Jalankan Server & Uji Koleksi Postman/Insomnia Bersama:**
   - Jalankan `php artisan serve`.
   - Eksekusi seluruh 8 skenario di Postman/Insomnia dan pastikan 100% sesuai ekspektasi.
4. **Kesiapan Demo:**
   - Anggota 1 menjelaskan alur konsep JWT + implementasi `POST /api/login` & struktur token.
   - Anggota 2 mendemokan skenario Postman/Insomnia (login valid/gagal, no token `401`, invalid token `401`, dan valid token CRUD `200`/`201`).
