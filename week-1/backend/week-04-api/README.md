# Week 04 — Sprint 03: Connect to an API (Backend Deliverable)

## Bobot task dan hasil backend

1. **Connect to API:** backend menyediakan endpoint HTTP yang dapat dipanggil frontend.
2. **Display API Data:** backend mengirim data layanan dalam JSON terstruktur; frontend yang merendernya ke DOM.
3. **Handle API State:** backend mengembalikan HTTP status dan format error konsisten. Status loading berada di sisi pemanggil (frontend), bukan di backend.

Folder ini sengaja belum menggunakan MVC/OOP kompleks. Fokusnya adalah kontrak API dan response HTTP.

## Endpoint

- `GET /api/services.php` — daftar layanan.
- `GET /api/services.php?id=1` — satu layanan.
- `GET /api/health.php` — pemeriksaan API.

## Menjalankan dengan PHP built-in server

Dari folder ini:

```bash
php -S 127.0.0.1:8004 -t public
```

Tes:

```bash
curl -i http://127.0.0.1:8004/api/health.php
curl -i http://127.0.0.1:8004/api/services.php
curl -i "http://127.0.0.1:8004/api/services.php?id=1"
```

## Uji dengan Bruno

Gunakan base URL `http://127.0.0.1:8004`. Import file request dari folder `bruno/` atau buat request GET sesuai endpoint di atas.

## Batasan

Data masih statis dan hanya untuk kontrak API. Tidak ada database, booking, payment, autentikasi, atau frontend di folder ini.
