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
        if ($id < 1) {
            throw new \InvalidArgumentException('Service ID must be positive.');
        }
        if (trim($name) === '') {
            throw new \InvalidArgumentException('Service name is required.');
        }
        if ($price < 0 || $durationMinutes < 1) {
            throw new \InvalidArgumentException('Price or duration is invalid.');
        }
    }

    public function getId(): int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getDescription(): string { return $this->description; }
    public function getPrice(): int { return $this->price; }
    public function getDurationMinutes(): int { return $this->durationMinutes; }
    public function getCategory(): string { return $this->category; }
    public function isActive(): bool { return $this->isActive; }

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
