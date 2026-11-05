# Week 5 — Sprint 04: Build DR. MEOWW Server-Side (Procedural PHP)

## Target Pertemuan 5
- **Frontend UI**: Antarmuka web interaktif berbasis React + Vite (`frontend/`).
- **Server-Side Processing**: Pemrosesan sisi server berbasis **PHP Prosedural** (`backend/public/index.php` & `backend/includes/*.php`).
- **Pengolahan Data Server-Side**: Menggunakan variabel, associative array, kondisional (`if-else`), perulangan (`foreach`), serta fungsi prosedural (`function`) untuk validasi, pemfilteran, dan persistensi JSON (`storage/db.json`) yang dikonsumsi Frontend React melalui `/api/v1/*`.

## Cara Menjalankan
1. Jalankan Backend PHP Prosedural:
   ```bash
   cd backend
   php -S 127.0.0.1:8000 -t public
   ```
2. Jalankan Frontend React/Vite:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
