# Pembagian Tugas Kelompok - Pertemuan 10 (Sprint 08)
**Proyek:** Dr. Meow Application  
**Fokus Sprint:** *Controller, Routing, Validation & RESTful API Testing*  
**Referensi:** `dr-meow-app/target-per-pertemuan.md` (Pertemuan 10)

---

## 🎯 Target Capaian Pertemuan 10
1. **Pemisahan Logika CRUD ke Controller:** Menggunakan method standar (`index`, `show`, `store`, `update`, `destroy`) untuk memproses request pengguna.
2. **Konfigurasi Routing:** Endpoint RESTful yang rapi di `routes/api.php` dan `routes/web.php` dengan HTTP method yang tepat (`GET`, `POST`, `PUT/PATCH`, `DELETE`).
3. **Validasi Input Ketat:** Mencegah data tidak valid dengan aturan seperti `required`, `max`, `numeric`, `date`, `exists`, dll.
4. **Standarisasi Respon & HTTP Status Code:** Respon JSON standar dengan status code tepat (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `422 Unprocessable Content`).
5. **Pengujian API (Postman / Insomnia):** Bukti pengujian seluruh skenario (sukses & validasi gagal) beserta ekspor file koleksi Postman.
6. **Riwayat Git:** Commit dan push yang rapi ke repositori kelompok.

---

## 📊 Tabel Evaluasi Objektif Target Pertemuan 10 (Kondisi Snapshot Week-9)

> **Catatan Penting untuk Tim:**  
> Berdasarkan evaluasi kode sumber di `week-9`, kelompok kita sebenarnya **sudah mencicil ~50% target Pertemuan 10** (fondasi Controller & Routing RESTful sudah ada).  
> Fokus utama di `week-10` ini adalah **menyelesaikan 50% sisanya**: yaitu **Validasi Input (`$request->validate` / `Validator`), HTTP 422**, dan **Pengujian Postman**.

| Butir Target Pertemuan 10 | Status dari Week 9 | Fakta & Kondisi di Kode Saat Ini |
|---|:---:|---|
| **1. Pemisahan Logika CRUD ke Controller** | **SUDAH (85%)** | Sudah ada 4 controller API (`ServiceController`, `CustomerController`, `CatController`, `ReservationController`) dengan method `index`, `show`, `store`, `update`, `destroy`. |
| **2. Routing API & Web (`GET`, `POST`, `PUT`, `DELETE`)** | **SUDAH (100%)** | Di `routes/api.php` sudah memakai `Route::apiResource(...)` yang otomatis memetakan seluruh HTTP method RESTful. |
| **3. Aturan Validasi Input (`$request->validate`)** | ❌ **BELUM (0%)** | **Belum ada sama sekali.** Di semua controller, method `store` dan `update` masih langsung menelan input mentah: `$data = $request->all();` tanpa pengecekan `required`, `max`, `numeric`, dll. |
| **4. HTTP Status Code Lengkap (`200, 201, 404, 422`)** | ⚠️ **SEBAGIAN (50%)** | Status `200`, `201`, dan `404` sudah ada di `Controller.php`. Namun status **`422` (Validation Error)** sama sekali belum pernah dipakai karena validasi belum ada. |
| **5. Pengujian API (Postman / Insomnia)** | ❌ **BELUM (0%)** | Belum ada file dokumentasi/export koleksi Postman (`.json`) di repositori untuk bukti uji skenario sukses & error. |

---

## 📐 Standarisasi Respon API (Sesuai `Controller.php`)
Tetap gunakan base method yang sudah tersedia di `app/Http/Controllers/Controller.php`:

### Respon Sukses (200 / 201)
```php
return $this->success($data, 'Data berhasil diambil/disimpan', 200); // atau 201
```
*Hasil JSON:*
```json
{
  "success": true,
  "message": "Data berhasil disimpan",
  "data": { ... },
  "errors": []
}
```

### Respon Validasi Gagal (422)
Gunakan `Validator::make(...)` agar tetap konsisten dengan format base controller:
```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($request->all(), [
    'field_name' => 'required|string|max:100',
]);

if ($validator->fails()) {
    return $this->error('Validation error', 422, $validator->errors()->toArray());
}
```
*Hasil JSON:*
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "errors": {
    "field_name": [
      "The field_name field is required."
    ]
  }
}
```

---

## 👥 Rincian Pembagian Tugas (2 Anggota)

### 👤 Anggota 1: Master Data Domain & Postman Collection Bagian 1
**Fokus File Backend:**
- `app/Http/Controllers/Api/ServiceController.php`
- `app/Http/Controllers/Api/CustomerController.php`
- `app/Http/Controllers/Api/CatController.php`

**Checklist Tugas:**
- [ ] **Validasi Service (`ServiceController.php`):**
  - `store` & `update`:
    - `name`: `required|string|max:100`
    - `category`: `required|in:grooming,hotel,clinic,styling`
    - `price`: `required|numeric|min:0`
    - `duration_minutes`: `nullable|integer|min:15`
    - `is_active`: `boolean`
  - Pastikan return status code: `201` untuk create, `200` untuk read/update/delete, `404` jika not found, `422` jika validasi gagal.
- [ ] **Validasi Customer (`CustomerController.php`):**
  - `store` & `update`:
    - `name`: `required|string|max:100`
    - `phone`: `required|string|max:20`
    - `email`: `nullable|email|max:100`
    - `address`: `nullable|string|max:255`
- [ ] **Validasi Cat (`CatController.php`):**
  - `store` & `update`:
    - `customer_id`: `required|exists:customers,customer_id` (atau relasi id tabel customer)
    - `name`: `required|string|max:50`
    - `breed`: `nullable|string|max:50`
    - `age_years`: `nullable|numeric|min:0`
    - `weight_kg`: `nullable|numeric|min:0`
- [ ] **Testing Postman (Services, Customers, Cats):**
  - Buat folder request di Postman untuk masing-masing entitas:
    - `GET /api/v1/services` (200)
    - `POST /api/v1/services` Valid (201)
    - `POST /api/v1/services` Invalid/Empty payload (422)
    - `GET /api/v1/services/{id}` Found (200) & Not Found (404)
    - Lakukan skenario yang sama untuk `customers` dan `cats`.

---

### 👤 Anggota 2: Transaction Domain (Reservations), Postman Bagian 2 & Frontend Feedback
**Fokus File Backend & Frontend:**
- `app/Http/Controllers/Api/ReservationController.php`
- `resources/js/services/reservationApi.ts` & Komponen Form Booking Frontend
- Export & Merge Postman Collection

**Checklist Tugas:**
- [ ] **Validasi Reservation (`ReservationController.php`):**
  - `store` & `update`:
    - `service_id`: `required|exists:services,id`
    - `customer_id`: `required|exists:customers,id` (atau customer_id)
    - `cat_id`: `required|exists:cats,id` (atau cat_id)
    - `reservation_date`: `required|date|after_or_equal:today`
    - `time_slot`: `required|string`
    - `status`: `in:pending,confirmed,completed,cancelled`
    - `notes`: `nullable|string|max:500`
  - Penanganan status code `201` untuk created, `422` saat validasi gagal, dan `404` jika ID reservasi tidak ada.
- [ ] **Testing Postman (Reservations):**
  - Buat folder request di Postman untuk modul Reservation:
    - `GET /api/v1/reservations` (200)
    - `POST /api/v1/reservations` Valid (201)
    - `POST /api/v1/reservations` Tanggal masa lalu / foreign key salah (422)
    - `GET /api/v1/reservations/{id}` Not Found (404)
    - `PUT /api/v1/reservations/{id}` Update status (200)
    - `DELETE /api/v1/reservations/{id}` (200)
- [ ] **Integrasi Pesan Error ke Frontend (Opsional Nilai Tambah):**
  - Pada form reservasi di React (`resources/js/...`), tangkap respon error `422` dari backend lalu tampilkan pesan error di bawah input yang bersangkutan (misal: "Tanggal reservasi tidak boleh tanggal kemarin").
- [ ] **Export & Penggabungan Postman Collection:**
  - Gabungkan request dari Anggota 1 dan Anggota 2 menjadi 1 file:
    `week-10/dr-meow-laravel/postman/Dr_Meow_API_Week10.postman_collection.json`.

---

## 🚀 Panduan Workflow Git Paralel

1. **Buat Branch Kerja Masing-Masing:**
   - Anggota 1:
     ```bash
     git checkout -b feat/week-10-master-data
     ```
   - Anggota 2:
     ```bash
     git checkout -b feat/week-10-reservations
     ```
2. **Commit Rutin:**
   - Contoh pesan commit Anggota 1:
     `feat(service): add validation rules and 422 error handling`
   - Contoh pesan commit Anggota 2:
     `feat(reservation): implement date validation and postman test cases`
3. **Merge ke Branch Utama:**
   - Setelah selesai dan diuji di Postman, satukan branch ke branch utama (`main` / `dev`).
