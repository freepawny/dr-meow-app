# Grooming Dr. Meow — Backend API (OOP)

Backend API PHP berbasis Object-Oriented Programming (OOP) dengan RESTful routing, penyimpanan persisten JSON (`storage/db.json`), dukungan penuh CORS untuk Frontend React, serta koleksi testing Bruno.

## Fitur
- **Object-Oriented Architecture**: Menggunakan Entity `Service` dengan enkapsulasi data dan `ServiceRepository` untuk operasi data.
- **RESTful Routing & Full CRUD**:
  - `GET /api/v1/health` — Health check
  - `GET /api/v1/services` — Daftar semua layanan (mendukung filter `?active=true`)
  - `GET /api/v1/services/{id}` — Detail layanan berdasarkan ID
  - `POST /api/v1/services` — Menambahkan layanan baru
  - `PUT /api/v1/services/{id}` — Memperbarui layanan
  - `DELETE /api/v1/services/{id}` — Menghapus layanan
- **Persistent JSON Database**: Data tersimpan di `storage/db.json` dengan safe file locking (`flock`).
- **CORS Support**: Mengizinkan akses dari frontend Vite/React (`http://localhost:5173`, `http://127.0.0.1:5173`).
- **Testing**: Dilengkapi koleksi Bruno di folder `bruno/`.

## Cara Menjalankan Server
Dari folder backend ini, jalankan PHP built-in server:

```bash
php -S 127.0.0.1:8000 -t public
```

Server akan aktif di `http://127.0.0.1:8000`.

## Testing via cURL
- **Health Check:**
  ```bash
  curl -i http://127.0.0.1:8000/api/v1/health
  ```
- **Ambil Semua Layanan:**
  ```bash
  curl -i http://127.0.0.1:8000/api/v1/services
  ```
- **Tambah Layanan Baru (POST):**
  ```bash
  curl -i -X POST http://127.0.0.1:8000/api/v1/services \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Grooming Kutu\",\"description\":\"Perawatan basmi kutu\",\"price\":75000,\"duration_minutes\":60,\"category\":\"treatment\",\"is_active\":true}"
  ```
