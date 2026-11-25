# Langkah-Langkah Mencapai Target Pertemuan 11: Sprint 09 – Build Secure API (JWT Authentication)

Panduan ini disusun berdasarkan [target-per-pertemuan.md](../../target-per-pertemuan.md) untuk **Pertemuan 11 (Sprint 09)** dan disesuaikan dengan struktur proyek Laravel `dr-meow-laravel` saat ini.

---

## Ringkasan Target Pertemuan 11

1. Memahami konsep dasar *authentication*, perbedaan *session* vs *token*, serta struktur dan fungsi *JSON Web Token* (JWT).
2. Mengimplementasikan *endpoint* `POST /api/login` yang memverifikasi `email` & `password`, membuat JWT, dan mengembalikan JSON berisi `access_token` dan `token_type: bearer`.
3. Menerapkan *JWT middleware* dan *protected route* pada *endpoint* API (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`) dengan verifikasi header `Authorization: Bearer <token>`.
4. Menangani akses *protected API*: token valid diterima, sedangkan *request* tanpa token atau token tidak valid ditolak dengan status `401 Unauthorized`.
5. Menguji seluruh skenario (login valid/gagal, *valid token*, *no token*, *invalid token*) di Postman/Insomnia dan siap untuk demo.
6. Melakukan *commit & push* implementasi ke repositori GitHub.

---

## Langkah 1: Pahami Konsep Dasar Authentication & JWT

Sebelum menulis kode, pastikan seluruh anggota tim memahami poin konsep berikut (sering ditanyakan saat demo/evaluasi):

- **Authentication vs Authorization**:
  - *Authentication*: Memverifikasi **siapa** pengguna (contoh: login dengan `email` dan `password`).
  - *Authorization*: Memverifikasi **apa yang boleh** diakses pengguna setelah terautentikasi.
- **Session-Based vs Token-Based (Stateless)**:
  - *Session-based*: Server menyimpan data sesi pengguna di memori/database/file, lalu mengirim `session_id` via *cookie*. Kurang ideal untuk REST API *cross-platform* (mobile/SPA).
  - *Token-based (JWT)*: Server **tidak** menyimpan sesi (*stateless*). Server menandatangani token dan memberikannya ke klien. Klien mengirim token di setiap *request* melalui header `Authorization: Bearer <token>`.
- **Struktur JSON Web Token (JWT)** — terdiri dari 3 bagian dipisah titik (`xxxxx.yyyyy.zzzzz`):
  1. **Header**: Algoritma penandatanganan (misal `HS256`) dan tipe token (`JWT`).
  2. **Payload**: Data klaim (*claims*) seperti `sub` (ID user), `iat` (*issued at*), `exp` (*expiration time*).
  3. **Signature**: Tanda tangan kriptografis menggunakan `JWT_SECRET` di server agar token tidak bisa dipalsukan atau diubah isinya.

---

## Langkah 2: Persiapan Tabel `users`, Model `User`, dan Seeder

Pada kondisi awal `dr-meow-laravel`, model `app/Models/User.php` sudah ada, namun belum terdapat file *migration* untuk tabel `users` di `database/migrations/`.

### 2.1. Buat Migration Tabel `users`

Jalankan perintah berikut di direktori `dr-meow-app/week-11/dr-meow-laravel`:

```bash
php artisan make:migration create_users_table
```

Isi skema tabel `users` pada method `up()` di file migration yang baru dibuat:

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

### 2.2. Buat Seeder Akun Pengguna Uji Coba

Buat seeder agar tersedia akun untuk pengujian `POST /api/login`:

```bash
php artisan make:seeder UserSeeder
```

Contoh isi `database/seeders/UserSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@drmeow.test'],
            [
                'name' => 'Admin Dr. Meow',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
```

Jalankan *migration* dan *seeder*:

```bash
php artisan migrate
php artisan db:seed --class=UserSeeder
```

---

## Langkah 3: Instalasi & Konfigurasi Library JWT

Gunakan package `php-open-source-saver/jwt-auth` (penerus aktif `tymon/jwt-auth` yang mendukung Laravel modern).

### 3.1. Install Package via Composer

```bash
composer require php-open-source-saver/jwt-auth
```

### 3.2. Publish Config & Generate JWT Secret

```bash
php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

Perintah `php artisan jwt:secret` akan otomatis menambahkan `JWT_SECRET=...` ke dalam file `.env`.

### 3.3. Update Model `app/Models/User.php`

Implementasikan interface `JWTSubject` pada `User`:

```php
<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }
}
```

### 3.4. Konfigurasi Guard `api` di `config/auth.php`

Buka `config/auth.php` dan tambahkan guard `api` dengan driver `jwt` di bagian `'guards'`:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

---

## Langkah 4: Implementasi Endpoint Autentikasi (`POST /api/login`)

### 4.1. Buat `AuthController`

```bash
php artisan make:controller Api/AuthController
```

Isi `app/Http/Controllers/Api/AuthController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password',
                'data' => null,
                'errors' => [],
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ], 200);
    }

    public function me(): JsonResponse
    {
        return $this->success(auth('api')->user(), 'Authenticated user retrieved successfully');
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return $this->success(null, 'Successfully logged out');
    }
}
```

> **Catatan**: Respon `login()` di atas sengaja menyertakan `access_token` dan `token_type: 'bearer'` di level root JSON agar sesuai persis dengan spesifikasi pada `target-per-pertemuan.md`, sekaligus tetap menjaga konsistensi flag `success` dan `message` dari `ApiResponse`.

---

## Langkah 5: Penerapan JWT Middleware & Protected Routes

### 5.1. Daftarkan Route Public & Protected di `routes/api.php`

Sesuaikan `routes/api.php` agar:
- `POST /api/login` dan `GET /api/v1/health` dapat diakses secara **publik** (tanpa token).
- Seluruh endpoint resource (`services`, `customers`, `cats`, `reservations` — `GET`, `POST`, `PUT`/`PATCH`, `DELETE`) dilindungi oleh middleware `auth:api`.

```php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

// Public Auth Endpoint (sesuai target: POST /api/login)
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('v1')->group(function () {
    // 1. Health Check (Public)
    Route::get('/health', [HealthController::class, 'index']);

    // Protected Routes (Wajib Authorization: Bearer <token>)
    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // 2. Services Endpoints
        Route::apiResource('services', ServiceController::class);

        // 3. Customers Endpoints & Relasi Khusus
        Route::apiResource('customers', CustomerController::class);
        Route::get('/customers/{customerId}/cats', [CustomerController::class, 'cats']);
        Route::get('/customers/{customerId}/reservations', [CustomerController::class, 'reservations']);

        // 4. Cats Endpoints
        Route::apiResource('cats', CatController::class);

        // 5. Reservations Endpoints
        Route::apiResource('reservations', ReservationController::class);
    });
});
```

### 5.2. Pastikan Penanganan `401 Unauthorized` Mengembalikan JSON Rapi

Di `bootstrap/app.php`, konfigurasi `shouldRenderJsonWhen` untuk `api/*` sudah aktif. Namun untuk memastikan `AuthenticationException` (saat *request* ke *protected route* tanpa token atau token tidak valid) selalu mengembalikan format JSON `401` yang seragam dan tidak mencoba redirect ke route `login`, tambahkan penanganan di `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->shouldRenderJsonWhen(
        fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
    );

    $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
        if ($request->is('api/*') || $request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null,
                'errors' => [],
            ], 401);
        }
    });
})
```

### 5.3. Verifikasi Daftar Route

Jalankan perintah berikut untuk memastikan middleware `auth:api` sudah terpasang pada route yang tepat:

```bash
php artisan route:list --path=api
```

---

## Langkah 6: Pengujian Menyeluruh di Postman / Insomnia

Jalankan server lokal Laravel terlebih dahulu:

```bash
php artisan serve
```

Lalu uji seluruh skenario wajib berikut di Postman atau Insomnia (tambahkan header `Accept: application/json` pada setiap *request*):

| No | Skenario Uji | Method & URL | Header / Body | Ekspektasi Status & Respon |
|---|---|---|---|---|
| 1 | **Login Valid** | `POST /api/login` | Body JSON: `{"email": "admin@drmeow.test", "password": "password123"}` | `200 OK` — mengembalikan `access_token` dan `token_type: "bearer"` |
| 2 | **Login Gagal (Password/Email Salah)** | `POST /api/login` | Body JSON: `{"email": "admin@drmeow.test", "password": "salah"}` | `401 Unauthorized` |
| 3 | **Login Validasi Error** | `POST /api/login` | Body JSON kosong `{}` | `422 Unprocessable Entity` |
| 4 | **Akses Protected Route Tanpa Token** | `GET /api/v1/services` | Tanpa header `Authorization` | `401 Unauthorized` |
| 5 | **Akses Protected Route dengan Invalid Token** | `GET /api/v1/services` | Header `Authorization: Bearer token_asal_salah` | `401 Unauthorized` |
| 6 | **Akses Protected Route dengan Valid Token (GET)** | `GET /api/v1/services` | Header `Authorization: Bearer <access_token>` | `200 OK` — data services tampil |
| 7 | **Akses Protected Route dengan Valid Token (POST/PUT/DELETE)** | `POST /api/v1/services` (dan endpoint `customers`, `cats`, `reservations`) | Header `Authorization: Bearer <access_token>` + Body JSON valid | `201 Created` / `200 OK` sesuai operasi CRUD |
| 8 | **Akses Public Health Check** | `GET /api/v1/health` | Tanpa header `Authorization` | `200 OK` |

> **Tips Demo**: Simpan *collection* Postman/Insomnia beserta *environment variable* `{{token}}` yang otomatis terisi setelah *login* agar demo berjalan cepat dan lancar.

---

## Langkah 7: Commit & Push ke GitHub

Setelah seluruh skenario pengujian berhasil dan tidak ada error:

```bash
git status
git add .
git commit -m "feat(week-11): implement JWT authentication and protect API routes"
git push origin <nama-branch-anda>
```

---

## Checklist Akhir Kesiapan Pertemuan 11

- [ ] Tabel `users` sudah termigrasi dan memiliki minimal 1 akun uji coba.
- [ ] `POST /api/login` mengembalikan `access_token` dan `token_type: bearer` untuk kredensial valid.
- [ ] `POST /api/login` mengembalikan `401 Unauthorized` untuk kredensial salah.
- [ ] Seluruh route CRUD `/api/v1/...` terlindungi oleh middleware `auth:api`.
- [ ] Request tanpa token atau dengan token tidak valid ditolak dengan `401 Unauthorized`.
- [ ] Seluruh skenario sudah diuji di Postman/Insomnia dan siap didemokan.
- [ ] Perubahan sudah di-*commit* dan di-*push* ke GitHub.
