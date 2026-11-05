<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Entities\Reservation;

final class ReservationRepository
{
    public function __construct(
        private JsonDatabase $database
    ) {}

    /**
     * @return Reservation[]
     */
    public function findAll(): array
    {
        $data = $this->database->read();
        $rows = $data['reservations'] ?? [];

        $reservations = [];

        foreach ($rows as $row) {
            $reservations[] = Reservation::fromArray($row);
        }

        return $reservations;
    }

    public function findById(
        string $reservationId
    ): ?Reservation {
        foreach ($this->findAll() as $reservation) {
            if (
                $reservation->getReservationId()
                === $reservationId
            ) {
                return $reservation;
            }
        }

        return null;
    }

    /**
     * @return Reservation[]
     */
    public function findByCustomerId(
        string $customerId
    ): array {
        $reservations = [];

        foreach ($this->findAll() as $reservation) {
            if (
                $reservation->getCustomerId()
                === $customerId
            ) {
                $reservations[] = $reservation;
            }
        }

        return $reservations;
    }

    public function create(array $attributes): Reservation
    {
        $data = $this->database->read();
        $rows = $data['reservations'] ?? [];

        if (empty($attributes['reservation_id'])) {
            $attributes['reservation_id'] = $this->generateId();
        }

        $reservation = Reservation::fromArray($attributes);

        $rows[] = $reservation->toArray();

        $data['reservations'] = $rows;
        $this->database->write($data);

        return $reservation;
    }

    public function update(
        string $reservationId,
        array $attributes
    ): ?Reservation {
        $data = $this->database->read();
        $rows = $data['reservations'] ?? [];

        foreach ($rows as $index => $row) {
            if (
                (string) ($row['reservation_id'] ?? '')
                !== $reservationId
            ) {
                continue;
            }

            $merged = array_merge(
                $row,
                $attributes,
                ['reservation_id' => $reservationId]
            );

            $reservation = Reservation::fromArray($merged);

            $rows[$index] = $reservation->toArray();

            $data['reservations'] = $rows;
            $this->database->write($data);

            return $reservation;
        }

        return null;
    }

    public function delete(string $reservationId): bool
    {
        $data = $this->database->read();
        $rows = $data['reservations'] ?? [];

        foreach ($rows as $index => $row) {
            if (
                (string) ($row['reservation_id'] ?? '')
                !== $reservationId
            ) {
                continue;
            }

            array_splice($rows, $index, 1);

            $data['reservations'] = $rows;
            $this->database->write($data);

            return true;
        }

        return false;
    }

    private function generateId(): string
    {
        return 'RES-' . strtoupper(bin2hex(random_bytes(4)));
    }
}