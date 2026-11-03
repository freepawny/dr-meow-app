<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Entities\Service;

final class InMemoryServiceRepository
{
    /** @return Service[] */
    public function findActive(): array
    {
        return [
            new Service(1, 'Basic Grooming', 'Mandi dan perawatan dasar.', 50000, 60, 'basic'),
            new Service(2, 'Full Grooming', 'Perawatan lengkap untuk kucing.', 85000, 90, 'full'),
            new Service(3, 'Kitten Grooming', 'Perawatan khusus anak kucing.', 45000, 45, 'kitten'),
        ];
    }

    public function findActiveById(int $id): ?Service
    {
        foreach ($this->findActive() as $service) {
            if ($service->getId() === $id) {
                return $service;
            }
        }
        return null;
    }
}
