# Grooming Dr. Meow — Backend Server-Side Procedural PHP (Week 5)

Implementasi backend **Pertemuan 5 (Sprint 04 — Build Server-Side)** berbasis **PHP Prosedural Murni** tanpa `class`/objek OOP maupun MVC, melayani antarmuka Frontend React/Vite.

## Karakteristik Arsitektur Prosedural
- Memanfaatkan variabel, associative array, struktur kontrol/kondisional (`if-else`), perulangan (`foreach`), dan fungsi modular (`includes/*.php`).
- Entry point tunggal `public/index.php` menangani seluruh endpoint REST API JSON CRUD (`/api/v1/health`, `/services`, `/customers`, `/cats`, `/reservations`) untuk Frontend React.

## Cara Menjalankan Server
```bash
php -S 127.0.0.1:8000 -t public
```
