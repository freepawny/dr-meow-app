# Week 6 — Sprint 05: Build DR. MEOWW with OOP

## Target Pertemuan 6
- **Object-Oriented Web Interface**: Kode server-side PHP distrukturkan menggunakan paradigma *Object-Oriented Programming (OOP)*.
- **Class, Object, Constructor & Enkapsulasi**:
  - Domain Entities (`backend/src/Entities/`): `Service`, `Customer`, `Cat`, dan `Reservation` dengan `private` properties, constructor `__construct()`, validasi objek, getter methods, `fromArray()`, dan `toArray()`.
  - Data Repositories (`backend/src/Repositories/`): `JsonDatabase`, `ServiceRepository`, `CustomerRepository`, `CatRepository`, dan `ReservationRepository`.
- **Dynamic Content via Object Methods**: Response API dibentuk secara dinamis melalui pemanggilan method pada objek entitas & repository (belum dipisahkan ke dalam pola MVC `Controller` / `View` / `Router`).

## Cara Menjalankan
1. Jalankan Backend OOP:
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
