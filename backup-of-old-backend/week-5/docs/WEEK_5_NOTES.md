# Week 05 — Catatan konsep

- Variabel: `$method`, `$path`, `$services`.
- Array associative: setiap layanan memiliki key `id`, `name`, `price`, `active`.
- Conditional: memeriksa method dan route, serta validasi ID.
- Loop: `foreach` menyaring layanan aktif dan mencari layanan berdasarkan ID.
- Dynamic server-side response: `json_encode()` membentuk JSON dari array hasil pemrosesan PHP.

Catatan penyesuaian untuk pembagian kerja: HTML/DOM tetap menjadi tanggung jawab frontend. Pada backend API, hasil server-side yang dikirim ke frontend adalah JSON, bukan markup halaman React.
