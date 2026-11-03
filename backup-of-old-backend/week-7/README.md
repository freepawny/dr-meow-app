# Grooming Dr. Meow — Week 07 MVC

Backend API PHP Native dengan arsitektur MVC, JSON file storage untuk latihan, dan repository layer yang dapat diganti dengan implementasi MariaDB.

## Kebutuhan
- PHP 8.1+ (menggunakan fitur `readonly`, named PHP 8.1)
- Ekstensi JSON PHP

## Menjalankan server
Dari folder `week-07-mvc`:

```bash
php -S 127.0.0.1:8007 -t public public/index.php
```

## Endpoint
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/services` | Daftar layanan |
| GET | `/api/v1/services?active=true` | Layanan aktif saja |
| GET | `/api/v1/services/{id}` | Detail layanan |
| POST | `/api/v1/services` | Membuat layanan |
| PUT | `/api/v1/services/{id}` | Memperbarui layanan |
| DELETE | `/api/v1/services/{id}` | Menghapus layanan |

Semua response memakai bentuk `{ success, message, data, errors }`.

## Contoh POST

```bash
curl -i -X POST http://127.0.0.1:8007/api/v1/services \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Grooming","description":"Layanan tes","price":60000,"duration_minutes":60,"category":"test","is_active":true}'
```

## Database dummy
Data awal ada di `storage/db.json`. PHP membaca dan menulis file ini. Untuk mengembalikan data awal, salin kembali file seed dari backup atau unzip ulang proyek.

**Keamanan:** jangan letakkan `storage` di dalam `public`. Jangan gunakan file JSON sebagai database produksi untuk aplikasi multi-user/transaksi bersamaan.

## Persiapan migrasi MariaDB
Service Layer bergantung pada `ServiceRepositoryInterface`, bukan implementasi JSON tertentu. Saat migrasi, buat `PdoServiceRepository` yang mengimplementasikan interface tersebut dengan PDO dan query MariaDB (`findAll`, `findById`, `create`, `update`, `delete`), lalu ubah dependency injection di `app/Routes/api.php`. Dengan begitu Controller dan Service Layer tidak perlu ditulis ulang.

## CORS
Origin development yang diizinkan: `http://localhost:5173` dan `http://127.0.0.1:5173`. Sesuaikan `public/index.php` untuk domain frontend lain.

## Apache
`public/.htaccess` membutuhkan `mod_rewrite` dan `AllowOverride All`. DocumentRoot sebaiknya diarahkan ke folder `public`.

## Integrasi React
Lihat `REACT-INTEGRATION.md`.
