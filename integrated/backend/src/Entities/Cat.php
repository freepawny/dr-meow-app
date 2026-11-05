<?php

declare(strict_types=1);

namespace App\Entities;

final class Cat
{
    public function __construct(
        private string $catId,
        private string $customerId,
        private string $name,
        private float $weight,
        private string $breeds,
        private ?float $vitalTemperature,
        private string $tempramen,
        private string $medicalHistory,
        private ?string $lastPicture
    ) {
        $this->validate();
    }

    public static function fromArray(array $data): self
    {
        $vitalTemperature = $data['vital_temperature'] ?? null;
        $lastPicture = $data['last_picture'] ?? null;

        return new self(
            trim((string) ($data['cat_id'] ?? '')),
            trim((string) ($data['customer_id'] ?? '')),
            trim((string) ($data['name'] ?? '')),
            (float) ($data['weight'] ?? 0),
            trim((string) ($data['breeds'] ?? '')),
            $vitalTemperature === null
                ? null
                : (float) $vitalTemperature,
            trim((string) ($data['tempramen'] ?? '')),
            trim((string) ($data['medical_history'] ?? '')),
            $lastPicture === null
                ? null
                : trim((string) $lastPicture)
        );
    }

    private function validate(): void
    {
        if ($this->catId === '') {
            throw new \InvalidArgumentException(
                'Cat ID is required.'
            );
        }

        if ($this->customerId === '') {
            throw new \InvalidArgumentException(
                'Cat customer ID is required.'
            );
        }

        if ($this->name === '') {
            throw new \InvalidArgumentException(
                'Cat name is required.'
            );
        }

        if ($this->weight <= 0) {
            throw new \InvalidArgumentException(
                'Cat weight must be greater than zero.'
            );
        }

        if ($this->breeds === '') {
            throw new \InvalidArgumentException(
                'Cat breeds is required.'
            );
        }

        if (
            $this->vitalTemperature !== null
            && $this->vitalTemperature <= 0
        ) {
            throw new \InvalidArgumentException(
                'Cat vital temperature must be greater than zero.'
            );
        }

        if ($this->tempramen === '') {
            throw new \InvalidArgumentException(
                'Cat tempramen is required.'
            );
        }
    }

    public function getCatId(): string
    {
        return $this->catId;
    }

    public function getCustomerId(): string
    {
        return $this->customerId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getWeight(): float
    {
        return $this->weight;
    }

    public function getBreeds(): string
    {
        return $this->breeds;
    }

    public function getVitalTemperature(): ?float
    {
        return $this->vitalTemperature;
    }

    public function getTempramen(): string
    {
        return $this->tempramen;
    }

    public function getMedicalHistory(): string
    {
        return $this->medicalHistory;
    }

    public function getLastPicture(): ?string
    {
        return $this->lastPicture;
    }

    public function toArray(): array
    {
        return [
            'cat_id' => $this->catId,
            'customer_id' => $this->customerId,
            'name' => $this->name,
            'weight' => $this->weight,
            'breeds' => $this->breeds,
            'vital_temperature' => $this->vitalTemperature,
            'tempramen' => $this->tempramen,
            'medical_history' => $this->medicalHistory,
            'last_picture' => $this->lastPicture,
        ];
    }
}