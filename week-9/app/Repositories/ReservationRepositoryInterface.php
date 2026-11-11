<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Models\Reservation;

interface ReservationRepositoryInterface
{
    /** @return Reservation[] */
    public function findAll(): array;
    public function findById(string $reservationId): ?Reservation;
    /** @return Reservation[] */
    public function findByCustomerId(string $customerId): array;
    public function create(array $attributes): Reservation;
    public function update(string $reservationId, array $attributes): ?Reservation;
    public function delete(string $reservationId): bool;
}
