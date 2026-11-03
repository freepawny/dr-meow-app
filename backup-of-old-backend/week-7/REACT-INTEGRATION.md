# Integrasi React dengan API Week 7

## 1. Konfigurasi Vite

Buat `frontend/.env.development`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8007/api/v1
```

Setelah mengubah `.env`, restart `npm run dev`.

## 2. API client (`src/services/api.js`)

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json();
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `HTTP ${response.status}`);
  }
  return result;
}
```

## 3. Service API (`src/services/serviceApi.js`)

```js
import { apiRequest } from "./api";

export const getServices = () => apiRequest("/services");
export const getService = (id) => apiRequest(`/services/${id}`);
export const createService = (data) => apiRequest("/services", {
  method: "POST", body: JSON.stringify(data),
});
export const updateService = (id, data) => apiRequest(`/services/${id}`, {
  method: "PUT", body: JSON.stringify(data),
});
export const deleteService = (id) => apiRequest(`/services/${id}`, {
  method: "DELETE",
});
```

## 4. Komponen daftar layanan

```jsx
import { useEffect, useState } from "react";
import { getServices } from "../services/serviceApi";

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getServices()
      .then((result) => { if (active) setServices(result.data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <p>Memuat layanan...</p>;
  if (error) return <p role="alert">Gagal memuat: {error}</p>;

  return (
    <section>
      <h1>Daftar Layanan</h1>
      {services.length === 0 ? <p>Belum ada layanan.</p> : services.map((service) => (
        <article key={service.id}>
          <h2>{service.name}</h2>
          <p>{service.description}</p>
          <p>Rp {service.price.toLocaleString("id-ID")}</p>
          <p>{service.duration_minutes} menit</p>
        </article>
      ))}
    </section>
  );
}
```

## 5. Pindah pengujian Week

Ubah `VITE_API_BASE_URL` saja:
- Week 4: `http://127.0.0.1:8004/api/v1`
- Week 5: `http://127.0.0.1:8005/api/v1`
- Week 6: `http://127.0.0.1:8006/api/v1`
- Week 7: `http://127.0.0.1:8007/api/v1`

Setiap backend harus mempertahankan kontrak endpoint dan response yang sama.
