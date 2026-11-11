<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Models\Cat;

interface CatRepositoryInterface
{
    /** @return Cat[] */
    public function findAll(): array;
    public function findById(string $catId): ?Cat;
    /** @return Cat[] */
    public function findByCustomerId(string $customerId): array;
    public function create(array $attributes): Cat;
    public function update(string $catId, array $attributes): ?Cat;
    public function delete(string $catId): bool;
}
