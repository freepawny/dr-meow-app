## **Pertemuan 1: Course Orientation & Project Kickoff**

- _Product Canvas_ (dokumen rancangan ide, target pengguna, masalah yang diselesaikan, dan fitur utama).
- _Repository_ GitHub proyek bersama tim.
- Pembentukan tim pengembang dan pembagian peran (_developer_, UI/UX, _project/product_, _tester_).
- _(Catatan: Pada tahap ini belum ada pengerjaan coding)_.

## **Pertemuan 2: Sprint 01 – Build the PresidentKu Web Interface**

- Struktur halaman web berbasis _Semantic HTML_.
- Halaman web dengan tampilan visual dan _layout_ rapi menggunakan CSS.
- Desain antarmuka yang responsif di berbagai perangkat (desktop & mobile) tanpa _horizontal overflow_.
- Halaman web yang sudah diuji serta riwayat _commit & push_ ke GitHub.

## **Pertemuan 3: Sprint 02 – Make PresidentKu Interactive**

- Halaman web yang dinamis dan interaktif menggunakan JavaScript dan manipulasi DOM.
- Penerapan _event handling_ (seperti aksi klik pada tombol/menu atau form) yang merespons input/interaksi pengguna secara langsung.
- Kode JavaScript bebas dari error dan tidak merusak layout antarmuka yang telah dibuat.
- Riwayat _commit & push_ fitur interaktif ke repositori GitHub.

## **Pertemuan 4: Sprint 03 – Connect PresidentKu to an API**

- _Data-Driven Web Interface_: antarmuka web yang terhubung dengan REST API melalui _Fetch API_.
- Pengolahan data JSON (array of objects) untuk menampilkan data dinamis secara otomatis ke dalam struktur DOM.
- Implementasi _loading state_ (indikator tunggu saat data sedang diambil).
- Penerapan _error handling_ (penanganan pesan kesalahan jika request API gagal).
- Riwayat _commit & push_ integrasi data ke repositori GitHub.

## **Pertemuan 5: Sprint 04 – Build PresidentKu Server-Side**

- _Server-Side Web Interface_: halaman web dinamis berbasis PHP prosedural yang dijalankan pada server lokal.
- Pengolahan data di sisi server memanfaatkan variabel, struktur kontrol/kondisional (_if-else_), _looping_ (_foreach_), dan fungsi (_function_).
- Halaman web yang menghasilkan struktur output HTML dinamis dari proses PHP.
- Riwayat _commit & push_ implementasi server-side ke repositori GitHub.

## **Pertemuan 6: Sprint 05 – Build PresidentKu with OOP**

- _Object-Oriented Web Interface_: kode server-side yang distrukturkan menggunakan paradigma OOP (_Object-Oriented Programming_).
- Pembuatan _Class_ dan instansiasi _Object_ dengan _properties_ dan _methods_ untuk merepresentasikan data entitas.
- Penerapan fungsi konstruktor (`__construct`) dan enkapsulasi sederhana (_public/private data access_).
- Konten HTML dinamis yang dihasilkan dari pemanggilan _method_ pada objek PHP.
- Riwayat _commit & push_ refaktor kode OOP ke repositori GitHub.

## **Pertemuan 7: Sprint 06 – Structure PresidentKu with MVC**

- _MVC-Based Web Application_: arsitektur proyek web yang telah dipisahkan secara modular ke dalam pola MVC (_Model-View-Controller_).
- Komponen **Model** yang menangani representasi data dan logika bisnis.
- Komponen **Controller** yang menerima request pengguna dan menjembatani alur proses antara Model dan View.
- Komponen **View** yang khusus menangani presentasi dan tampilan antarmuka HTML tanpa tercampur logika data.
- Aplikasi berfungsi utuh dari _HTTP request_ hingga respon tampilan, serta riwayat _commit & push_ modular ke repositori GitHub.

## **Pertemuan 9: Sprint 07 – Build PresidentKu Data Management**

- Proyek berbasis framework Laravel yang aktif dan berhasil terkoneksi dengan database.
- Struktur tabel database yang terbentuk melalui skema _migration_.
- Implementasi _Eloquent Model_ dengan atribut `$fillable` untuk mengelola data database secara berorientasi objek.
- Fungsionalitas CRUD lengkap (_Create_, _Read_, _Update_, _Delete_) untuk manajemen data program yang tersimpan langsung di database.
- Halaman antarmuka PresidentKu yang dinamis dengan data murni bersumber dari database tanpa data _hard-code_.
- Riwayat _commit & push_ fitur _data management_ ke repositori GitHub.

## **Pertemuan 10: Sprint 08 – Controller, Routing & Validation**

- Pemisahan alur logika CRUD ke dalam **`Controller`** dengan _method_ standar (`index`, `create`, `store`, `edit`, `update`, `destroy`) untuk menerima dan memproses `Request` pengguna.
- Konfigurasi _Routing_ pada `routes/web.php` dan `routes/api.php` menggunakan HTTP Method yang sesuai (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`).
- Implementasi aturan validasi input (`$request->validate`) seperti `required` dan `max` pada proses tambah maupun ubah data untuk mencegah penyimpanan data yang tidak valid.
- Pembangunan endpoint **RESTful API** (`/api/programs`) yang mengembalikan respon berformat JSON beserta _HTTP Status Code_ yang tepat (`200`, `201`, `400`, `404`, `422`, `500`).
- Pengujian seluruh _endpoint_ API (CRUD dan skenario _validation error_) menggunakan Postman atau Insomnia.
- Riwayat _commit & push_ implementasi _Controller, Routing, Validation,_ dan _REST API_ ke repositori GitHub.