# Week 05 — Sprint 04: Build Server-Side PHP (Backend Deliverable)

## Bobot task dan hasil backend

1. **Create PHP Page:** untuk backend API, halaman PHP dipahami sebagai skrip server-side yang menerima request HTTP; bukan halaman UI untuk menggantikan React.
2. **Process Data with PHP:** memakai variabel, array, conditional, dan loop untuk memproses data layanan.
3. **Build Dynamic Server-Side Content:** PHP membentuk response JSON secara dinamis dari data yang diproses.

Pada minggu ini kita mulai menggunakan satu entry point `public/index.php`. Ini bukan file testing sementara; pada arsitektur front-controller, entry point tetap digunakan saat frontend sudah terhubung.

## Endpoint

- `GET /api/services`
- `GET /api/services?id=1`
- `GET /api/health`

## Menjalankan

```bash
php -S 127.0.0.1:8005 -t public
```

Tes:

```bash
curl -i http://127.0.0.1:8005/api/services
curl -i "http://127.0.0.1:8005/api/services?id=2"
curl -i http://127.0.0.1:8005/api/health
```

## Pembeda dari Week 04

Week 04 menggunakan file endpoint langsung. Week 05 memusatkan request melalui `index.php` dan memproses path, method, data, serta response pada sisi server. Belum menerapkan OOP/MVC.
