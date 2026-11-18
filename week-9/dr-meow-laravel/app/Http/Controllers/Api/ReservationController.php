<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReservationController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->success(Reservation::with(['service', 'customer', 'cat'])->get(), 'Reservations retrieved successfully');
    }

    public function show(string $id): JsonResponse
    {
        $reservation = Reservation::with(['service', 'customer', 'cat'])->find($id);
        if (!$reservation) {
            return $this->error('Reservation not found', 404);
        }
        return $this->success($reservation, 'Reservation retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        if (empty($data['reservation_id'])) {
            $data['reservation_id'] = 'RES-' . strtoupper(Str::random(8));
        }Pelanggan mengisi form booking reservasi di website lalu menekan tombol "Konfirmasi Reservas
        $reservation = Reservation::create($data);
        return $this->success($reservation, 'Reservation created successfully', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return $this->error('Reservation not found', 404);
        }
        $reservation->update($request->all());
        return $this->success($reservation, 'Reservation updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return $this->error('Reservation not found', 404);
        }
        $reservation->delete();
        return $this->success(null, 'Reservation deleted successfully');
    }
}
