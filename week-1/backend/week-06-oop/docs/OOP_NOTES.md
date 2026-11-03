# Week 06 — OOP Notes

- `Service` adalah Entity: satu objek domain yang memiliki identitas dan atribut layanan.
- Property `private` menjaga encapsulation.
- Constructor menjaga objek tidak dibuat dengan nilai dasar yang tidak valid.
- `toArray()` menyiapkan representasi data untuk response API; Entity tidak mencetak JSON atau mengakses HTTP.
- `InMemoryServiceRepository` menyediakan kumpulan Entity untuk latihan OOP. Namanya menegaskan bahwa ini belum terhubung MariaDB.

Jalankan dari folder `week-06-oop`:

```bash
php -S 127.0.0.1:8006 -t public
```

Tes:

```bash
curl -i http://127.0.0.1:8006/api/services
curl -i "http://127.0.0.1:8006/api/services?id=1"
```
