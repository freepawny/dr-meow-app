# API Contract — Week 04

Base URL development: `http://127.0.0.1:8004`

## GET /api/services.php

Sukses `200`:

```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Basic Grooming",
      "description": "Mandi, pengeringan, penyisiran, dan potong kuku.",
      "price": 50000,
      "duration_minutes": 60,
      "category": "basic"
    }
  ]
}
```

## GET /api/services.php?id=1

Mengembalikan satu object pada `data`. Jika ID tidak ditemukan: `404`. Jika ID bukan bilangan bulat positif: `400`.

## GET /api/health.php

Mengembalikan status layanan API.

## Error format

```json
{
  "success": false,
  "message": "Service not found",
  "errors": []
}
```

Frontend bertanggung jawab menampilkan loading selama request berlangsung. Backend bertanggung jawab memberikan status HTTP dan payload sukses/error.
