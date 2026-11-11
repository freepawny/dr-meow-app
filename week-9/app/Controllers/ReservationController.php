<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\JsonView;
use App\Core\Request;
use App\Services\ReservationService;

final class ReservationController
{
    public function __construct(private ReservationService $reservationService) {}

    public function index(Request $request): never
    {
        JsonView::success(
            $this->reservationService->listReservations(),
            'Reservations retrieved successfully'
        );
    }

    public function show(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        JsonView::success(
            $this->reservationService->getReservation($id),
            'Reservation retrieved successfully'
        );
    }

    public function store(Request $request): never
    {
        JsonView::success(
            $this->reservationService->createReservation($request->body),
            'Reservation created successfully',
            201
        );
    }

    public function update(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        JsonView::success(
            $this->reservationService->updateReservation($id, $request->body),
            'Reservation updated successfully'
        );
    }

    public function destroy(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        $this->reservationService->deleteReservation($id);
        JsonView::success(null, 'Reservation deleted successfully');
    }

    private function requireId(array $params, string $key): string
    {
        $id = trim((string) ($params[$key] ?? ''));
        if ($id === '') {
            JsonView::error('Reservation ID is required', 400);
        }
        return $id;
    }
}
