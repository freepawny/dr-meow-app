<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\HttpException;
use App\Models\Service;
use App\Repositories\ServiceRepositoryInterface;

final class ServiceService
{
    public function __construct(private ServiceRepositoryInterface $repository) {}

    public function listServices(bool $activeOnly = false): array
    {
        return array_map(
            static fn(Service $service): array => $service->toArray(),
            $this->repository->findAll($activeOnly)
        );
    }

    public function getService(string $id): array
    {
        $service = $this->repository->findById($id);
        if ($service === null) {
            throw new HttpException('Service not found', 404);
        }
        return $service->toArray();
    }

    public function createService(array $input): array
    {
        $this->validateInput($input, true);
        return $this->repository->create($input)->toArray();
    }

    public function updateService(string $id, array $input): array
    {
        if ($this->repository->findById($id) === null) {
            throw new HttpException('Service not found', 404);
        }
        $this->validateInput($input, false);
        $updated = $this->repository->update($id, $input);
        if ($updated === null) {
            throw new HttpException('Service not found', 404);
        }
        return $updated->toArray();
    }

    public function deleteService(string $id): void
    {
        if (!$this->repository->delete($id)) {
            throw new HttpException('Service not found', 404);
        }
    }

    private function validateInput(array $input, bool $isCreating): void
    {
        $allowed = [
            'id', 'name', 'badge_label', 'badgeLabel', 'description',
            'is_popular', 'isPopular', 'base_price', 'basePrice',
            'tier_prices', 'tierPrices', 'features', 'is_active', 'isActive'
        ];

        $unknown = array_diff(array_keys($input), $allowed);
        if ($unknown !== []) {
            throw new \InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
        }

        if ($isCreating) {
            $hasBadge = array_key_exists('badge_label', $input) || array_key_exists('badgeLabel', $input);
            $hasBasePrice = array_key_exists('base_price', $input) || array_key_exists('basePrice', $input);

            if (
                !array_key_exists('name', $input)
                || !array_key_exists('description', $input)
                || !$hasBadge
                || !$hasBasePrice
            ) {
                throw new \InvalidArgumentException(
                    "Fields 'name', 'badge_label', 'description', and 'base_price' are required."
                );
            }
        }

        if (isset($input['name']) && (!is_string($input['name']) || trim($input['name']) === '')) {
            throw new \InvalidArgumentException('Name must be a non-empty string.');
        }

        $badge = $input['badge_label'] ?? ($input['badgeLabel'] ?? null);
        if ($badge !== null && (!is_string($badge) || trim($badge) === '')) {
            throw new \InvalidArgumentException('badge_label must be a non-empty string.');
        }

        if (isset($input['description']) && (!is_string($input['description']) || trim($input['description']) === '')) {
            throw new \InvalidArgumentException('Description must be a non-empty string.');
        }

        $price = $input['base_price'] ?? ($input['basePrice'] ?? null);
        if ($price !== null && (!is_int($price) || $price < 0)) {
            throw new \InvalidArgumentException('base_price must be a non-negative integer.');
        }

        if (isset($input['features']) && !is_array($input['features'])) {
            throw new \InvalidArgumentException('Features must be an array.');
        }
    }
}
