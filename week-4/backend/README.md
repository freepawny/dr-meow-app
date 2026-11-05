# Grooming Dr. Meow — Backend API Contract (Week 4)

Penyedia REST API JSON sederhana untuk tahap **Pertemuan 4 (Sprint 03 — Connect to an API)**.
Pada tahap ini backend berfokus menyediakan kontrak endpoint JSON (`{ success, message, data, errors }`), status HTTP, dan CORS melalui skrip endpoint langsung (`api/*.php`) tanpa abstraksi fungsi prosedural modular, OOP, ataupun MVC.

## Cara Menjalankan Server
```bash
php -S 127.0.0.1:8000 -t public
```

## Endpoint
- `GET /api/v1/health`
- `GET|POST /api/v1/services` & `GET|PUT|DELETE /api/v1/services/{id}`
- `GET|POST /api/v1/customers` & `GET|PUT|DELETE /api/v1/customers/{id}`
- `GET /api/v1/customers/{customerId}/cats`
- `GET /api/v1/customers/{customerId}/reservations`
- `GET|POST /api/v1/cats` & `GET|PUT|DELETE /api/v1/cats/{id}`
- `GET|POST /api/v1/reservations` & `GET|PUT|DELETE /api/v1/reservations/{id}`
