<?php

declare(strict_types=1);

namespace App\Entities;

final class Service
{
    public function __construct(
        private int $id,
        private string $name,
        private string $description,
        private int $price,
        private int $durationMinutes,
        private string $category,
        private bool $isActive = true
    ) {
        $this->validate();
    }

    public static function fromArray(array $data): self
    {
        return new self(
            (int) ($data['id'] ?? 0),
            trim((string) ($data['name'] ?? '')),
            trim((string) ($data['description'] ?? '')),
            (int) ($data['price'] ?? -1),
            (int) ($data['duration_minutes'] ?? 0),
            trim((string) ($data['category'] ?? '')),
            (bool) ($data['is_active'] ?? true)
        );
    }

    private function validate(): void
    {
        if ($this->id < 1) {
            throw new \InvalidArgumentException('Service ID must be a positive integer.');
        }
        if ($this->name === '') {
            throw new \InvalidArgumentException('Service name is required.');
        }
        if ($this->price < 0) {
            throw new \InvalidArgumentException('Service price cannot be negative.');
        }
        if ($this->durationMinutes < 1) {
            throw new \InvalidArgumentException('Service duration must be at least 1 minute.');
        }
        if ($this->category === '') {
            throw new \InvalidArgumentException('Service category is required.');
        }
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getPrice(): int
    {
        return $this->price;
    }

    public function getDurationMinutes(): int
    {
        return $this->durationMinutes;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'duration_minutes' => $this->durationMinutes,
            'category' => $this->category,
            'is_active' => $this->isActive,
        ];
    }
}
