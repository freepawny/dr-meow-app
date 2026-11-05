# Week 4 — Sprint 03: Connect DR. MEOWW to an API

## Target Pertemuan 4
- **Data-Driven Web Interface**: Antarmuka web React yang terhubung ke REST API melalui `Fetch API` (`src/services/api.ts`, `serviceApi.ts`, `reservationApi.ts`).
- **Pengolahan Data JSON**: Menampilkan array of objects (daftar layanan, pelanggan terdaftar, anabul, serta pembuatan reservasi) secara dinamis ke dalam DOM.
- **Loading State**: Indikator skeleton loading pada daftar paket layanan dan status loading pada form reservasi.
- **Error Handling**: Penanganan pesan kesalahan (`role="alert"`) dan tombol *Coba Lagi* pada seksi Pricing maupun Modal Reservasi ketika request API gagal.
- **Backend Kontrak API**: Skrip endpoint JSON sederhana (`backend/api/*.php`) tanpa OOP/MVC.

## Cara Menjalankan
1. Jalankan Backend API:
   ```bash
   cd backend
   php -S 127.0.0.1:8000 -t public
   ```
2. Jalankan Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
