<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Models\Customer;

interface CustomerRepositoryInterface
{
    /** @return Customer[] */
    public function findAll(): array;
    public function findById(string $customerId): ?Customer;
    public function create(array $attributes): Customer;
    public function update(string $customerId, array $attributes): ?Customer;
    public function delete(string $customerId): bool;
}
