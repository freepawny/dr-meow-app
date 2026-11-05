<?php
declare(strict_types=1);

namespace App\Models;

final class Customer
{
    public function __construct(
        private string $customerId,
        private string $name,
        private string $phoneNumber,
        private string $schedule,
        private string $address,
        private bool $preferenceNotification
    ) {
        $this->validate();
    }

    public static function fromArray(array $data): self
    {
        return new self(
            trim((string) ($data['customer_id'] ?? '')),
            trim((string) ($data['name'] ?? '')),
            trim((string) ($data['phone_number'] ?? '')),
            trim((string) ($data['schedule'] ?? '')),
            trim((string) ($data['address'] ?? '')),
            Service::normalizeBoolean($data['preference_notification'] ?? true)
        );
    }

    private function validate(): void
    {
        if ($this->customerId === '') {
            throw new \InvalidArgumentException('Customer ID is required.');
        }
        if ($this->name === '') {
            throw new \InvalidArgumentException('Customer name is required.');
        }
        if ($this->phoneNumber === '') {
            throw new \InvalidArgumentException('Customer phone number is required.');
        }
        if (!preg_match('/^\+?[0-9]{10,15}$/', $this->phoneNumber)) {
            throw new \InvalidArgumentException('Customer phone number format is invalid.');
        }
        if ($this->schedule === '') {
            throw new \InvalidArgumentException('Customer schedule is required.');
        }
        if ($this->address === '') {
            throw new \InvalidArgumentException('Customer address is required.');
        }
    }

    public function getCustomerId(): string { return $this->customerId; }
    public function getName(): string { return $this->name; }
    public function getPhoneNumber(): string { return $this->phoneNumber; }
    public function getSchedule(): string { return $this->schedule; }
    public function getAddress(): string { return $this->address; }
    public function getPreferenceNotification(): bool { return $this->preferenceNotification; }

    public function toArray(): array
    {
        return [
            'customer_id' => $this->customerId,
            'name' => $this->name,
            'phone_number' => $this->phoneNumber,
            'schedule' => $this->schedule,
            'address' => $this->address,
            'preference_notification' => $this->preferenceNotification,
        ];
    }
}
