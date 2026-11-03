<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Service;
use App\Repositories\ServiceRepositoryInterface;

final class ServiceService
{
    public function __construct(private ServiceRepositoryInterface $repository) {}

    public function listServices(bool $activeOnly = false): array
    {
        return array_map(static fn(Service $service): array => $service->toArray(), $this->repository->findAll($activeOnly));
    }

    public function getService(int $id): ?array
    {
        if ($id < 1) { throw new \InvalidArgumentException('ID must be a positive integer.'); }
        return $this->repository->findById($id)?->toArray();
    }

    public function createService(array $input): array
    {
        $this->validateInput($input, true);
        return $this->repository->create($input)->toArray();
    }

    public function updateService(int $id, array $input): ?array
    {
        if ($id < 1) { throw new \InvalidArgumentException('ID must be a positive integer.'); }
        $this->validateInput($input, false);
        return $this->repository->update($id, $input)?->toArray();
    }

    public function deleteService(int $id): bool
    {
        if ($id < 1) { throw new \InvalidArgumentException('ID must be a positive integer.'); }
        return $this->repository->delete($id);
    }

    private function validateInput(array $input, bool $creating): void
    {
        $allowed = ['name', 'description', 'price', 'duration_minutes', 'category', 'is_active'];
        $unknown = array_diff(array_keys($input), $allowed);
        if ($unknown !== []) { throw new \InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown)); }
        if ($creating) {
            foreach (['name', 'price', 'duration_minutes', 'category'] as $field) {
                if (!array_key_exists($field, $input)) { throw new \InvalidArgumentException("Field '{$field}' is required."); }
            }
        }
        if (isset($input['name']) && (!is_string($input['name']) || trim($input['name']) === '')) { throw new \InvalidArgumentException('Name must be a non-empty string.'); }
        if (isset($input['description']) && !is_string($input['description'])) { throw new \InvalidArgumentException('Description must be a string.'); }
        if (array_key_exists('price', $input) && (!is_int($input['price']) || $input['price'] < 0)) { throw new \InvalidArgumentException('Price must be a non-negative integer.'); }
        if (array_key_exists('duration_minutes', $input) && (!is_int($input['duration_minutes']) || $input['duration_minutes'] < 1)) { throw new \InvalidArgumentException('Duration must be a positive integer.'); }
        if (isset($input['category']) && (!is_string($input['category']) || trim($input['category']) === '')) { throw new \InvalidArgumentException('Category must be a non-empty string.'); }
        if (array_key_exists('is_active', $input) && !is_bool($input['is_active'])) { throw new \InvalidArgumentException('is_active must be a boolean.'); }
    }
}
