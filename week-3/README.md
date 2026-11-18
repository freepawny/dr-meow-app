# Week 3 — Sprint 02: Make DR. MEOWW Interactive (HTML, CSS & Vanilla JS)

## Target Pertemuan 3
- Antarmuka web dinamis dan interaktif menggunakan **HTML5, CSS modular, dan Vanilla JavaScript (DOM Manipulation & Event Handling)** tanpa framework React/Node dan belum terhubung ke REST API.
- Kode dipecah secara modular agar setiap file ramping dan mudah dipelihara:
  - **CSS (`frontend/css/`)**: `tokens.css`, `components.css`, `navbar-hero.css`, `pricing-delivery.css`, `showcase-branch.css`, `faq-footer.css`, dan `modal.css`.
  - **JavaScript (`frontend/js/`)**:
    - `data.js` — Matriks tarif layanan berdasarkan bobot kucing & pembentuk URL WhatsApp.
    - `navigation.js` — Toggle menu mobile & status aktif tab navigasi.
    - `pricing.js` — Perpindahan tab *Paket Grooming* vs *Penitipan Kucing* & kalkulasi harga otomatis saat memilih ukuran berat kucing (`<2 kg`, `>2 kg`, `>5 kg`).
    - `showcase-faq.js` — Carousel *Before & After* serta accordion interaktif FAQ.
    - `modal-view.js` — Injeksi struktur DOM dialog Modal Reservasi.
    - `reservation-modal.js` — Event handling form reservasi, validasi input, kalkulasi estimasi tagihan *real-time*, dan ringkasan bukti booking.

## Cara Membuka
Buka langsung file `frontend/index.html` di browser atau jalankan melalui *Live Server*.
