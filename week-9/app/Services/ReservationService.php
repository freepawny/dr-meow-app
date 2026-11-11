<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\HttpException;
use App\Models\Reservation;
use App\Repositories\CatRepositoryInterface;
use App\Repositories\CustomerRepositoryInterface;
use App\Repositories\ReservationRepositoryInterface;
use App\Repositories\ServiceRepositoryInterface;

final class ReservationService
{
    public function __construct(
        private ReservationRepositoryInterface $reservationRepository,
        private CustomerRepositoryInterface $customerRepository,
        private CatRepositoryInterface $catRepository,
        private ServiceRepositoryInterface $serviceRepository
    ) {}

    public function listReservations(): array
    {
        return array_map(
            static fn(Reservation $res): array => $res->toArray(),
            $this->reservationRepository->findAll()
        );
    }

    public function getReservation(string $reservationId): array
    {
        $reservation = $this->reservationRepository->findById($reservationId);
        if ($reservation === null) {
            throw new HttpException('Reservation not found', 404);
        }
        return $reservation->toArray();
    }

    public function listReservationsByCustomer(string $customerId): array
    {
        if ($this->customerRepository->findById($customerId) === null) {
            throw new HttpException('Customer not found', 404);
        }

        return array_map(
            static fn(Reservation $res): array => $res->toArray(),
            $this->reservationRepository->findByCustomerId($customerId)
        );
    }

    public function createReservation(array $input): array
    {
        $this->validateInput($input, true);

        $customerId = (string) $input['customer_id'];
        $catId = (string) $input['cat_id'];
        $serviceId = (string) $input['service_id'];

        $customer = $this->customerRepository->findById($customerId);
        if ($customer === null) {
            throw new HttpException('Customer not found', 404);
        }

        $cat = $this->catRepository->findById($catId);
        if ($cat === null) {
            throw new HttpException('Cat not found', 404);
        }

        if (!$cat->belongsToCustomer($customerId)) {
            throw new HttpException('The selected cat does not belong to this customer', 422);
        }

        $service = $this->serviceRepository->findById($serviceId);
        if ($service === null) {
            throw new HttpException('Service not found', 404);
        }

        if (!$service->isActive()) {
            throw new HttpException('Service is currently inactive', 422);
        }

        if (!isset($input['total_bill'])) {
            $input['total_bill'] = $service->calculatePriceForWeight($cat->getWeight());
        }

        return $this->reservationRepository->create($input)->toArray();
    }

    public function updateReservation(string $reservationId, array $input): array
    {
        if ($this->reservationRepository->findById($reservationId) === null) {
            throw new HttpException('Reservation not found', 404);
        }

        $this->validateInput($input, false);

        if (isset($input['customer_id']) && $this->customerRepository->findById((string) $input['customer_id']) === null) {
            throw new HttpException('Customer not found', 404);
        }

        if (isset($input['cat_id']) && $this->catRepository->findById((string) $input['cat_id']) === null) {
            throw new HttpException('Cat not found', 404);
        }

        if (isset($input['service_id']) && $this->serviceRepository->findById((string) $input['service_id']) === null) {
            throw new HttpException('Service not found', 404);
        }

        $updated = $this->reservationRepository->update($reservationId, $input);
        if ($updated === null) {
            throw new HttpException('Reservation not found', 404);
        }

        return $updated->toArray();
    }

    public function deleteReservation(string $reservationId): void
    {
        if (!$this->reservationRepository->delete($reservationId)) {
            throw new HttpException('Reservation not found', 404);
        }
    }

    private function validateInput(array $input, bool $isCreating): void
    {
        $allowed = [
            'reservation_id', 'service_id', 'customer_id', 'cat_id',
            'service_method', 'work_status', 'notification_h1',
            'total_bill', 'paymen_status', 'before_after'
        ];

        $unknown = array_diff(array_keys($input), $allowed);
        if ($unknown !== []) {
            throw new \InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
        }

        $required = ['service_id', 'customer_id', 'cat_id', 'service_method'];
        if ($isCreating) {
            foreach ($required as $field) {
                if (!array_key_exists($field, $input)) {
                    throw new \InvalidArgumentException("Field '{$field}' is required.");
                }
            }
        }

        foreach ($required as $field) {
            if (array_key_exists($field, $input) && (!is_string($input[$field]) || trim($input[$field]) === '')) {
                throw new \InvalidArgumentException("{$field} must be a non-empty string.");
            }
        }

        if (array_key_exists('notification_h1', $input) && !is_bool($input['notification_h1'])) {
            throw new \InvalidArgumentException('notification_h1 must be a boolean.');
        }

        if (array_key_exists('total_bill', $input) && (!is_int($input['total_bill']) || $input['total_bill'] < 0)) {
            throw new \InvalidArgumentException('total_bill must be a non-negative integer.');
        }

        if (array_key_exists('before_after', $input) && !is_array($input['before_after'])) {
            throw new \InvalidArgumentException('before_after must be an object or array.');
        }
    }
}
