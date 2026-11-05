<?php

declare(strict_types=1);

namespace App\Entities;

final class Service
{
    /**
     * @param array<string, int> $tierPrices
     * @param array<int, string> $features
     */
    public function __construct(
        private string $id,
        private string $name,
        private string $badgeLabel,
        private string $description,
        private bool $isPopular,
        private int $basePrice,
        private array $tierPrices,
        private array $features,
        private bool $isActive = true
    ) {
        $this->validate();
    }

    public static function fromArray(array $data): self
    {

        $rawTierPrices = $data['tier_prices'] ?? $data['prices'] ??[];


        $tierPrices = [];

        if(is_array($rawTierPrices)){
            foreach($rawTierPrices as $tier => $price){
                $tierPrices[(string) $tier] = (int) $price;
            }
        }

        $rawFeatures = $data['features']?? [];

       $features = [];

       if(is_array($rawFeatures)){
        foreach($rawFeatures as $item){
            if(is_string($item)){
                $features[]=$item;
            } elseif(is_array($item)&& isset($item['text'])){
                $features []= (string) $item['text'];
            }
        }
       }


        $isPopular = $data['is_popular'] ?? $data ['isPopular'] ??(($data['variant']??'') === 'popular');

        $isActive = $data ['is_active']?? $data['isActive'] ?? true;


        return new self(
            trim((string) ($data['id'] ?? '')),
            trim((string) ($data['name'] ?? '')),
            trim((string) ($data['badge_label'] ?? ($data['badgeLabel'] ?? ''))),
            trim((string) ($data['description'] ?? '')),
             self::normalizeBoolean($isPopular),
            (int) ($data['base_price'] ?? $data['basePrice'] ?? $data['price'] ?? 0),
            $tierPrices,
            $features,
            self::normalizeBoolean($isActive)
        );
    }


    public static function normalizeBoolean(mixed $value) : bool {
        if(is_bool($value)){
            return $value;
        }

        if(is_string($value)){
            return match (strtolower(trim($value))){
                'true', '1' =>true,
                'false', '0' => false,
                default => throw new \InvalidArgumentException('Invalid boolean value'),
            };
        }

        if (is_int($value)){
            return match ($value){
                1=> true,
                0 => false,
                default => throw new \InvalidArgumentException('Invalud boolean value'),
            };
        }

        throw new \InvalidArgumentException('Boolean value must be a boolean, string, or integer');
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
            throw new \InvalidArgumentException('Service badge_label is required.');
        }
        if ($this->description === '') {
            throw new \InvalidArgumentException('Service description is required.');
        }
        if ($this->basePrice < 0) {
            throw new \InvalidArgumentException('Service base_price cannot be negative.');
        }
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getBadgeLabel(): string
    {
        return $this->badgeLabel;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function isPopular(): bool
    {
        return $this->isPopular;
    }

    public function getBasePrice(): int
    {
        return $this->basePrice;
    }

    public function getTierPrices(): array
    {
        return $this->tierPrices;
    }

    public function getFeatures(): array
    {
        return $this->features;
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
            'badge_label' => $this->badgeLabel,
            'description' => $this->description,
            'is_popular' => $this->isPopular,
            'base_price' => $this->basePrice,
            'tier_prices' => $this->tierPrices,
            'features' => $this->features,
            'is_active' => $this->isActive,
        ];
    }
}
