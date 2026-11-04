<?php

declare(strict_types=1);

namespace App\Entities;

final class Service
{
    /**
     * @param array<string, string> $prices
     * @param array<int, array{id: int|string, text: string}> $features
     */
    public function __construct(
        private string $id,
        private string $badgeLabel,
        private string $variant,
        private string $size,
        private string $name,
        private string $price,
        private array $prices,
        private string $priceUnit,
        private string $description,
        private array $features,
        private string $buttonLabel,
        private bool $isActive = true
    ) {
        $this->validate();
    }

    public static function fromArray(array $data): self
    {
        return new self(
            trim((string) ($data['id'] ?? '')),
            trim((string) ($data['badgeLabel'] ?? ($data['badge_label'] ?? ''))),
            trim((string) ($data['variant'] ?? 'default')),
            trim((string) ($data['size'] ?? '')),
            trim((string) ($data['name'] ?? '')),
            trim((string) ($data['price'] ?? '')),
            is_array($data['prices'] ?? null) ? $data['prices'] : [],
            trim((string) ($data['priceUnit'] ?? ($data['price_unit'] ?? '/ ekor'))),
            trim((string) ($data['description'] ?? '')),
            is_array($data['features'] ?? null) ? $data['features'] : [],
            trim((string) ($data['buttonLabel'] ?? ($data['button_label'] ?? ''))),
            (bool) ($data['is_active'] ?? ($data['isActive'] ?? true))
        );
    }

    private function validate(): void
    {
        if ($this->id === '') {
            throw new \InvalidArgumentException('Service ID is required.');
        }
        if ($this->name === '') {
            throw new \InvalidArgumentException('Service name is required.');
        }
        if ($this->badgeLabel === '') {
            throw new \InvalidArgumentException('Service badgeLabel is required.');
        }
        if ($this->description === '') {
            throw new \InvalidArgumentException('Service description is required.');
        }
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getBadgeLabel(): string
    {
        return $this->badgeLabel;
    }

    public function getVariant(): string
    {
        return $this->variant;
    }

    public function getSize(): string
    {
        return $this->size;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPrice(): string
    {
        return $this->price;
    }

    public function getPrices(): array
    {
        return $this->prices;
    }

    public function getPriceUnit(): string
    {
        return $this->priceUnit;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getFeatures(): array
    {
        return $this->features;
    }

    public function getButtonLabel(): string
    {
        return $this->buttonLabel;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'badgeLabel' => $this->badgeLabel,
            'variant' => $this->variant,
            'size' => $this->size,
            'name' => $this->name,
            'price' => $this->price,
            'prices' => $this->prices,
            'priceUnit' => $this->priceUnit,
            'description' => $this->description,
            'features' => $this->features,
            'buttonLabel' => $this->buttonLabel,
            'is_active' => $this->isActive,
        ];
    }
}
