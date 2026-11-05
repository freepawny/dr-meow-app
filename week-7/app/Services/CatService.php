<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\HttpException;
use App\Models\Cat;
use App\Repositories\CatRepositoryInterface;
use App\Repositories\CustomerRepositoryInterface;

final class CatService
{
    public function __construct(
        private CatRepositoryInterface $catRepository,
        private CustomerRepositoryInterface $customerRepository
    ) {}

    public function listCats(): array
    {
        return array_map(
            static fn(Cat $cat): array => $cat->toArray(),
            $this->catRepository->findAll()
        );
    }

    public function getCat(string $catId): array
    {
        $cat = $this->catRepository->findById($catId);
        if ($cat === null) {
            throw new HttpException('Cat not found', 404);
        }
        return $cat->toArray();
    }

    public function listCatsByCustomer(string $customerId): array
    {
        if ($this->customerRepository->findById($customerId) === null) {
            throw new HttpException('Customer not found', 404);
        }

        return array_map(
            static fn(Cat $cat): array => $cat->toArray(),
            $this->catRepository->findByCustomerId($customerId)
        );
    }

    public function createCat(array $input): array
    {
        $this->validateInput($input, true);

        $customerId = (string) $input['customer_id'];
        if ($this->customerRepository->findById($customerId) === null) {
            throw new HttpException('Customer not found', 404);
        }

        return $this->catRepository->create($input)->toArray();
    }

    public function updateCat(string $catId, array $input): array
    {
        if ($this->catRepository->findById($catId) === null) {
            throw new HttpException('Cat not found', 404);
        }

        $this->validateInput($input, false);

        if (isset($input['customer_id']) && $this->customerRepository->findById((string) $input['customer_id']) === null) {
            throw new HttpException('Customer not found', 404);
        }

        $updated = $this->catRepository->update($catId, $input);
        if ($updated === null) {
            throw new HttpException('Cat not found', 404);
        }

        return $updated->toArray();
    }

    public function deleteCat(string $catId): void
    {
        if (!$this->catRepository->delete($catId)) {
            throw new HttpException('Cat not found', 404);
        }
    }

    private function validateInput(array $input, bool $isCreating): void
    {
        $allowed = [
            'cat_id', 'customer_id', 'name', 'weight', 'breeds',
            'vital_temperature', 'tempramen', 'medical_history', 'last_picture'
        ];

        $unknown = array_diff(array_keys($input), $allowed);
        if ($unknown !== []) {
            throw new \InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
        }

        $required = ['customer_id', 'name', 'weight', 'breeds'];
        if ($isCreating) {
            foreach ($required as $field) {
                if (!array_key_exists($field, $input)) {
                    throw new \InvalidArgumentException("Field '{$field}' is required.");
                }
            }
        }

        foreach (['customer_id', 'name', 'breeds'] as $field) {
            if (array_key_exists($field, $input) && (!is_string($input[$field]) || trim($input[$field]) === '')) {
                throw new \InvalidArgumentException("{$field} must be a non-empty string.");
            }
        }

        if (array_key_exists('weight', $input) && (!is_numeric($input['weight']) || (float) $input['weight'] <= 0)) {
            throw new \InvalidArgumentException('weight must be a positive number.');
        }

        if (array_key_exists('vital_temperature', $input) && $input['vital_temperature'] !== null && !is_numeric($input['vital_temperature'])) {
            throw new \InvalidArgumentException('vital_temperature must be a number or null.');
        }

        foreach (['tempramen', 'medical_history', 'last_picture'] as $field) {
            if (array_key_exists($field, $input) && $input[$field] !== null && !is_string($input[$field])) {
                throw new \InvalidArgumentException("{$field} must be a string or null.");
            }
        }
    }
}
