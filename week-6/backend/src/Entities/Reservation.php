<?php

declare(strict_types=1);

namespace App\Entities;

final class Reservation
{
    /**
     * @param array<string, mixed> $beforeAfter
     */
    public function __construct(
        private string $reservationId,
        private string $serviceId,
        private string $customerId,
        private string $catId,
        private string $serviceMethod,
        private string $workStatus,
        private bool $notificationH1,
        private int $totalBill,
        private string $paymenStatus,
        private array $beforeAfter
    ) {
        $this->validate();
    }

    public static function fromArray(array $data): self
    {
        $beforeAfter = $data['before_after'] ?? [];

        if (!is_array($beforeAfter)) {
            $beforeAfter = [];
        }

        return new self(
            trim((string) ($data['reservation_id'] ?? '')),
            trim((string) ($data['service_id'] ?? '')),
            trim((string) ($data['customer_id'] ?? '')),
            trim((string) ($data['cat_id'] ?? '')),
            trim((string) ($data['service_method'] ?? '')),
            trim((string) ($data['work_status'] ?? 'Pending')),
            Customer::normalizeBoolean(
                $data['notification_h1'] ?? false
            ),
            (int) ($data['total_bill'] ?? 0),
            trim((string) ($data['paymen_status'] ?? 'Unpaid')),
            $beforeAfter
        );
    }

    private function validate(): void
    {
        if ($this->reservationId === '') {
            throw new \InvalidArgumentException(
                'Reservation ID is required.'
            );
        }

        if ($this->serviceId === '') {
            throw new \InvalidArgumentException(
                'Reservation service ID is required.'
            );
        }

        if ($this->customerId === '') {
            throw new \InvalidArgumentException(
                'Reservation customer ID is required.'
            );
        }

        if ($this->catId === '') {
            throw new \InvalidArgumentException(
                'Reservation cat ID is required.'
            );
        }

        if ($this->serviceMethod === '') {
            throw new \InvalidArgumentException(
                'Reservation service method is required.'
            );
        }

        if ($this->workStatus === '') {
            throw new \InvalidArgumentException(
                'Reservation work status is required.'
            );
        }

        if ($this->totalBill < 0) {
            throw new \InvalidArgumentException(
                'Reservation total bill cannot be negative.'
            );
        }

        if ($this->paymenStatus === '') {
            throw new \InvalidArgumentException(
                'Reservation payment status is required.'
            );
        }
    }

    public function getReservationId(): string
    {
        return $this->reservationId;
    }

    public function getServiceId(): string
    {
        return $this->serviceId;
    }

    public function getCustomerId(): string
    {
        return $this->customerId;
    }

    public function getCatId(): string
    {
        return $this->catId;
    }

    public function getServiceMethod(): string
    {
        return $this->serviceMethod;
    }

    public function getWorkStatus(): string
    {
        return $this->workStatus;
    }

    public function getNotificationH1(): bool
    {
        return $this->notificationH1;
    }

    public function getTotalBill(): int
    {
        return $this->totalBill;
    }

    public function getPaymenStatus(): string
    {
        return $this->paymenStatus;
    }

    public function getBeforeAfter(): array
    {
        return $this->beforeAfter;
    }

    public function toArray(): array
    {
        return [
            'reservation_id' => $this->reservationId,
            'service_id' => $this->serviceId,
            'customer_id' => $this->customerId,
            'cat_id' => $this->catId,
            'service_method' => $this->serviceMethod,
            'work_status' => $this->workStatus,
            'notification_h1' => $this->notificationH1,
            'total_bill' => $this->totalBill,
            'paymen_status' => $this->paymenStatus,
            'before_after' => $this->beforeAfter,
        ];
    }
}