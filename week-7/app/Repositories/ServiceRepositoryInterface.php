<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Service;

interface ServiceRepositoryInterface
{
    /** @return Service[] */
    public function findAll(bool $activeOnly = false): array;
    public function findById(int $id): ?Service;
    public function create(array $attributes): Service;
    public function update(int $id, array $attributes): ?Service;
    public function delete(int $id): bool;
}
