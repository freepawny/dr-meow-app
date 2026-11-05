<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\HttpException;
use App\Models\Customer;
use App\Repositories\CustomerRepositoryInterface;

final class CustomerService
{
    public function __construct(private CustomerRepositoryInterface $repository) {}

    public function listCustomers(): array
    {
        return array_map(
            static fn(Customer $customer): array => $customer->toArray(),
            $this->repository->findAll()
        );
    }

    public function getCustomer(string $customerId): array
    {
        $customer = $this->repository->findById($customerId);
        if ($customer === null) {
            throw new HttpException('Customer not found', 404);
        }
        return $customer->toArray();
    }

    public function createCustomer(array $input): array
    {
        $this->validateInput($input, true);
        return $this->repository->create($input)->toArray();
    }

    public function updateCustomer(string $customerId, array $input): array
    {
        if ($this->repository->findById($customerId) === null) {
            throw new HttpException('Customer not found', 404);
        }
        $this->validateInput($input, false);
        $updated = $this->repository->update($customerId, $input);
        if ($updated === null) {
            throw new HttpException('Customer not found', 404);
        }
        return $updated->toArray();
    }

    public function deleteCustomer(string $customerId): void
    {
        if (!$this->repository->delete($customerId)) {
            throw new HttpException('Customer not found', 404);
        }
    }

    private function validateInput(array $input, bool $isCreating): void
    {
        $allowed = [
            'customer_id', 'name', 'phone_number',
            'schedule', 'address', 'preference_notification'
        ];

        $unknown = array_diff(array_keys($input), $allowed);
        if ($unknown !== []) {
            throw new \InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
        }

        $required = ['name', 'phone_number', 'schedule', 'address'];
        if ($isCreating) {
            foreach ($required as $field) {
                if (!array_key_exists($field, $input)) {
                    throw new \InvalidArgumentException("Field '{$field}' is required.");
                }
            }
        }

        foreach ($required as $field) {
            if (array_key_exists($field, $input) && (!is_string($input[$field]) || trim($input[$field]) === '')) {
                throw new \InvalidArgumentException("{$field} must be a non-empty string.");
            }
        }

        if (array_key_exists('preference_notification', $input) && !is_bool($input['preference_notification'])) {
            throw new \InvalidArgumentException('preference_notification must be a boolean.');
        }
    }
}
