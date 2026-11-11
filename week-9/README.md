# Week 7 — Sprint 06: Structure DR. MEOWW with MVC

## Arsitektur Proyek Terpadu (Unified MVC)
Pada tahap Pertemuan 7 ini, folder `frontend/` dan `backend/` telah dilebur menjadi **satu kesatuan struktur proyek MVC modular**:

- **`app/Models/`** — Representasi data entitas & aturan bisnis domain (`Service`, `Customer`, `Cat`, `Reservation`) beserta abstraksi akses data di `app/Repositories/` dan koordinasi logika bisnis di `app/Services/`.
- **`app/Controllers/`** — Menerima HTTP `Request` dari `Router` dan menjembatani proses antara Model/Service dengan View (`ServiceController`, `CustomerController`, `CatController`, `ReservationController`, `HealthController`).
- **`app/Views/`** — Komponen antarmuka pengguna **React + TypeScript + Tailwind CSS (Vite)** asli dari DR. MEOWW (`pages/landing/*`, `features/reservation/*`, `components/*`, `services/*`) tanpa tercampur logika pemrosesan database server, ditambah `app/Core/JsonView.php` untuk serialisasi respon API.
- **`app/Routes/api.php` & `public/index.php`** — Routing terpusat dan *front-controller* aplikasi.
- **`storage/db.json`** — Penyimpanan persisten data layanan, pelanggan, anabul, dan reservasi.

## Cara Menjalankan (Development)
Dari root folder `week-7/`:

1. Jalankan server PHP MVC:
   ```bash
   php -S 127.0.0.1:8000 -t public
   ```
2. Di terminal kedua, jalankan Vite dev server untuk `app/Views`:
   ```bash
   npm install
   npm run dev
   ```
   *(Atau jalankan `npm run build` agar aplikasi React di `app/Views` dikompilasi ke `dist/` dan dapat langsung diakses melalui satu server saja di `http://127.0.0.1:8000/`).*
